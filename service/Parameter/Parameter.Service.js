const { ParameterRepository } = require("../../repository");
const {
  Paginate: { PaginationsGenerate },
} = require("../../utils");
const { dateNowFormat } = require("../../utils/Moment");

class ParameterService {
  async listParameterService(params) {
    const paginate = PaginationsGenerate(params);
    return await ParameterRepository.getParameterRepository(paginate);
  }
  async getOneParameterValueService(params) {
    return await ParameterRepository.getOneParameterValueRepository(params);
  }
  async createParameterValueService(params) {
    try {
      const lookup = await ParameterRepository.getOneParamLookupsRepository({
        lookup_code: params.lookup_code,
      });
      if (!lookup.status) return lookup;
      const value_code =
        await ParameterRepository.getOneParamLookupValueRepository({
          lookup_value_code: params.lookup_value_code,
        });
      if (value_code.status)
        return {
          status: true,
          response: value_code.response,
          messages: "Code Has Been Exst",
        };
      return await ParameterRepository.createParameterValueRepository({
        param_lookup_id: lookup.response.param_lookup_id,
        lookup_value_code: params.lookup_value_code,
        meaning: params.lookup_value_code,
        value: params.value,
        description: params.description,
        start_date_active: dateNowFormat("YYYY-MM-DD"),
        end_date_active: "2099-12-31",
        enabled_flag: "Y",
        created_by: params.id,
        updated_by: params.id,
      });
    } catch (e) {
      console.log(e);
      return this.fail(null, e.message);
    }
  }
  async updateParameterValueService(params) {
    try {
      const lookup = await ParameterRepository.getOneParamLookupsRepository({
        lookup_code: params.lookup_code,
      });
      if (!lookup.status) return lookup;

      const lookupValue =
        await ParameterRepository.getOneParamLookupValueRepository({
          lookup_value_id: params.lookup_value_id,
        });
      if (!lookupValue.status) return lookupValue;
      const value_code =
        await ParameterRepository.getOneParamLookupValueAdnNotRepository(
          {
            lookup_value_code: params.lookup_value_code,
          },
          {
            lookup_value_id: params.lookup_value_id,
          }
        );
      console.log(value_code);
      if (value_code.status)
        return {
          status: false,
          response: value_code.response,
          messages: "Code Has Been Exst",
        };
      return await ParameterRepository.updateParameterValueRepository(
        {
          param_lookup_id: lookup.response.param_lookup_id,
          lookup_value_code: params.lookup_value_code,
          meaning: params.lookup_value_code,
          value: params.value,
          description: params.description,
          enabled_flag: "Y",
          updated_by: params.id,
        },
        { lookup_value_id: params.lookup_value_id }
      );
    } catch (e) {
      return this.fail(null, e.message);
    }
  }
  async deleteParameterLookupValueService(params) {
    return await ParameterRepository.deleteParameterValueRepository({
      lookup_value_id: params.lookup_value_id,
    });
  }
  async parameterLookupService() {
    return await ParameterRepository.getParamLookupsRepository();
  }
  success(data, message) {
    return { status: true, response: data, messages: message };
  }

  fail(data, message) {
    return { status: false, response: data, messages: message };
  }
}

module.exports = new ParameterService();
