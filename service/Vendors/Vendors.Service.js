const { VendorsRepository } = require("../../repository");

class VendorsService {
  async createVendorService(params) {
    try {
      const credential = await VendorsRepository.getOneEmailPhoneRepository(
        params
      );
      if (!credential.status)
        return await VendorsRepository.createRepository({
          name: params.name,
          email: params.email,
          phone: params.phone,
          address: params.address,
          lat: params.lat,
          long: params.long,
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
  async getProductService() {
    try {
      return await VendorsRepository.getRepository();
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
}

module.exports = new VendorsService();
