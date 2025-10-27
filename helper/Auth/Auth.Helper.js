const {
  ResponsibilitiesRepository,
  AdminResponsibilitiesRepository,
  AdminsRepository,
} = require("../../repository");

class AuthHelper {
  async ResetAdminResponsibilities(params) {
    try {
      const responsibility = params.responsibilities_code;
      for (let i = 0; i < responsibility.length; i++) {
        const checkResponsiblity =
          await ResponsibilitiesRepository.getOneRepository({
            code: responsibility[i],
          });
        if (!checkResponsiblity.status) return checkResponsiblity;
        await AdminResponsibilitiesRepository.CreateRepository({
          admin_id: params.admin_id,
          responsibility_code: responsibility[i],
          created_by: params.created_by,
        });
      }

      return {
        status: true,
        response: null,
        messages: "Successfully Created Responsibilities",
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async GetDetailAdmin(params) {
    try {
      const [admin, adminResponsibilities] = await Promise.all([
        AdminsRepository.getOneRepository({
          id: params.admin_id,
          deleted_at: null,
        }),
        AdminResponsibilitiesRepository.getAllByAdminIDRepository(params),
      ]);
      if (!admin.status) return admin;
      delete admin.response.password;

      admin.response.responsibilities = adminResponsibilities.response;
      return admin;
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
}

module.exports = new AuthHelper();
