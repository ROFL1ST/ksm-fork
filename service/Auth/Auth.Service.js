const { AuthHelper } = require("../../helper");
const {
  AdminsRepository,
  AdminResponsibilitiesRepository,
  ResponsibilitiesRepository,
} = require("../../repository");
const {
  Hash: { PasswordEncrypt, PasswordCompare },
  RandomString: { generatePassword },
  Uuid: { uuids },
  Paginate: { PaginationsGenerate },
  JWT: { JWTGenerate, JWTRefreshGenerate },
  Upload: { GenerateImage },
} = require("../../utils");

const {
  WhatsAppTemplate: { RegisterAccountTemplate },
} = require("../../template");

class AuthService {
  async loginService(params) {
    try {
      const user = await AdminsRepository.getOneRepository({
        email: params.email,
        deleted_at: null,
      });

      if (!user.status) return this.fail(null, "This account not registered");

      const passwordMatch = await PasswordCompare(
        params.password,
        user.response.password
      );
      if (!passwordMatch.status)
        return this.fail(null, "Check email or password");

      // Remove sensitive data
      const { password, ...userData } = user.response;

      const accessToken = JWTGenerate({
        id: userData.id,
        data: userData,
      });
      const refreshToken = JWTRefreshGenerate({
        id: userData.id,
        data: userData,
      });

      return this.success(
        { accessToken, refreshToken, userData },
        "Successfully Login"
      );
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }

  async registerService(params) {
    try {
      const existing = await AdminsRepository.getOneRepository({
        email: params.email,
        deleted_at: null,
      });
      if (existing.status)
        return this.fail(null, "This account already registered");
      const existingPhone = await AdminsRepository.getOneRepository({
        phone: params.phone,
        deleted_at: null,
      });
      if (existingPhone.status)
        return this.fail(null, "This account already registered");
      const ID = uuids();
      // admin responsibilities
      const adminResponsibilities = await AuthHelper.ResetAdminResponsibilities(
        {
          responsibilities_code: params.responsibilities_code,
          admin_id: ID,
          created_by: params.id,
        }
      );
      if (!adminResponsibilities.status) return adminResponsibilities;

      const ramdomPassword = generatePassword(params.name);
      const encryptedPassword = await PasswordEncrypt(ramdomPassword);

      let request = {
        id: ID,
        email: params.email,
        name: params.name,
        phone: params.phone,
        password: encryptedPassword,
        created_by: params.id,
      };
      if (params.path) {
        const path = await GenerateImage({ path: params.path });
        request.path = path.response;
      }
      const created = await AdminsRepository.CreateRepository(request);

      if (!created.status) return created;

      // send whatsApp
      await RegisterAccountTemplate({
        email: params.email,
        phone: params.phone,
        password: ramdomPassword,
      });
      return this.success(null, "Succesfully Created Account");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async responsibilitiesService() {
    return await ResponsibilitiesRepository.getAllRepository();
  }
  async deleteAccountService(params) {
    try {
      const existing = await AdminsRepository.getOneRepository({
        id: params.admin_id,
      });
      if (!existing.status) return existing;
      const deleted = await AdminsRepository.UpdateRepository({
        id: params.admin_id,
        deleted_at: new Date(),
        deleted_by: params.id,
      });
      if (!deleted.status) return deleted;
      return this.success(null, "Successfully Deleted Account");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getResponsibilities(params) {
    try {
      return AuthHelper.GetDetailAdmin({ admin_id: params.id });
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getAccountsService(params) {
    try {
      const paginate = PaginationsGenerate(params);
      const response = await AdminsRepository.getAdminsRepository(paginate);
      let total_data = response.response.length ? response.response[0].exx : 0;
      let total_page =
        total_data > 0 ? Math.ceil(total_data / paginate.size) : 0;

      if (total_data > 0 && total_page === 0) total_page = 1;

      return {
        status: true,
        response: {
          total_data,
          total_page,
          accounts: response.response,
        },
      };
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getAccountsBoosterService(params) {
    try {
      return await AdminsRepository.getAdminsBoosterRepository(params);
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getAccountDetailService(params) {
    try {
      return await AuthHelper.GetDetailAdmin(params);
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async recoveryPasswordService(params) {
    try {
      const existing = await AdminsRepository.getOneRepository({
        id: params.id,
        deleted_at: null,
      });
      if (!existing.status) return existing;
      const encryptedPassword = await PasswordEncrypt(params.password);
      const updated = await AdminsRepository.UpdateRepository({
        id: params.id,
        password: encryptedPassword,
      });
      if (!updated.status) return updated;
      return this.success(null, "Successfully Update User");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async updateAccountService(params) {
    try {
      const existing = await AdminsRepository.getOneRepository({
        id: params.admin_id,
        deleted_at: null,
      });
      if (!existing.status) return existing;
      if (params.password) {
        const encryptedPassword = await PasswordEncrypt(params.password);
        params.password = encryptedPassword;
      } else {
        params.password = null;
      }

      const updatedBy = params.id;

      // delete responsibilities;
      const existingResponsibilities =
        await AdminResponsibilitiesRepository.DeleteRepository({
          admin_id: params.admin_id,
        });
      if (!existingResponsibilities.status) return existingResponsibilities;

      const adminResponsibilities = await AuthHelper.ResetAdminResponsibilities(
        {
          responsibilities_code: params.responsibilities_code,
          admin_id: params.admin_id,
        }
      );
      if (!adminResponsibilities.status) return adminResponsibilities;

      // store
      params = {
        id: params.admin_id,
        name: params.name,
        email: params.email,
        phone: params.phone,
        path: params.path,
        password: params.password ? params.password : undefined,
        updated_by: updatedBy,
      };

      if (params.path && !params.path.startsWith("https")) {
        const path = await GenerateImage({ path: params.path });
        params.path = path.response;
      }
      const updated = await AdminsRepository.UpdateRepository(params);
      if (!updated.status) return updated;
      return this.success(null, "Successfully Update User");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  success(data, message) {
    return { status: true, response: data, messages: message };
  }

  fail(data, message) {
    return { status: false, response: data, messages: message };
  }
}

module.exports = new AuthService();
