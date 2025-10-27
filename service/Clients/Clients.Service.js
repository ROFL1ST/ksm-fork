const { ClientsRepository } = require("../../repository");
const {
  Upload: { GenerateImage },
} = require("../../utils");

class ClientsService {
  async createClientService(params) {
    try {
      const credential = await ClientsRepository.getOneEmailPhoneRepository(
        params
      );
      if (params.path && params.path.startsWith("https"))
        params.path = (await GenerateImage({ path: params.path })).response;

      if (!credential.status)
        return await ClientsRepository.createRepository({
          name: params.name,
          email: params.email,
          phone: params.phone,
          address: params.address,
          lat: params.lat,
          long: params.long,
          path: params.path,
          created_by: params.id,
        });
      return {
        status: false,
        response: null,
        messages: "Email or Phone already used",
      };
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
  async updateClientService(params) {
    try {
      const credential = await ClientsRepository.getOneRepository({
        id: params.client_id,
      });
      if (params.path && params.path.startsWith("https"))
        params.path = (await GenerateImage({ path: params.path })).response;

      if (!credential.status) return credential;
      return await ClientsRepository.updateRepository(
        {
          name: params.name,
          email: params.email,
          phone: params.phone,
          address: params.address,
          lat: params.lat,
          long: params.long,
          path: params.path,
          updated_at: new Date(),
          updated_by: params.id,
        },
        {
          id: params.client_id,
        }
      );
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
  async deleteClientService(params) {
    try {
      const credential = await ClientsRepository.getOneRepository({
        id: params.client_id,
      });

      if (!credential.status) return credential;
      return await ClientsRepository.updateRepository(
        {
          deleted_at: new Date(),
          deleted_by: params.id,
        },
        {
          id: params.client_id,
        }
      );
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
  async getProductService() {
    try {
      return await ClientsRepository.getRepository();
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
}

module.exports = new ClientsService();
