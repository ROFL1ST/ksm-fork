const FinanceHelper = require("../../helper/Finance/Finance.Helper");
const {
  FinanceRepository,
  ParameterRepository,
  AdminResponsibilitiesRepository,
  GlobalAnalyticRepository,
} = require("../../repository");
const {
  Paginate: { PaginationsGenerate },
  Upload: { GenerateImage },
} = require("../../utils");
class FinanceService {
  // CREATE
  async createService(params) {
    try {
      return FinanceHelper.createFinanceHelper({
        finance_code: params.finance_code,
        input_date: params.input_date,
        description: params.description,
        category_code: params.category_code,
        source_id: "xxx",
        source_table: "finnace",
        total: params.total,
        status_code: params.status_code,
        path: params.path,
        created_by: params.id,
      });
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }

  // GET (list all)
  async getService(params) {
    try {
      const paginate = PaginationsGenerate(params);
      const response = await FinanceRepository.getRepository(paginate);
      let total_data = response.response.length ? response.response[0].exx : 0;
      let total_page =
        total_data > 0 ? Math.ceil(total_data / paginate.size) : 0;

      const statusCode =
        await ParameterRepository.getParamLookupValuesRepository({
          lookup_code: "STATUS_TRX",
        });
      const categoryCode =
        await ParameterRepository.getParamLookupValuesRepository({
          lookup_code:
            params.finance_code === "EXPENSE"
              ? "CATEGORY_EXPENSE"
              : "CATEGORY_INCOME",
        });

      const { response: header } =
        await GlobalAnalyticRepository.getFinanceSummary(params);
      return {
        status: true,
        response: {
          total_data,
          total_page,
          header,
          status_code: statusCode.response,
          category_code: categoryCode.response,
          data: response.response,
        },
      };
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }

  // DETAIL (get by id)
  async detailService(params) {
    try {
      const result = await FinanceRepository.getOneRepository({
        id: params.finance_id,
      });
      if (!result) {
        return {
          status: false,
          response: null,
          messages: "Finance record not found",
        };
      }
      return {
        status: true,
        response: result,
        messages: "Finance record fetched successfully",
      };
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }

  // UPDATE
  async updateService(params) {
    try {
      const exist = await FinanceRepository.getOneRepository({
        id: params.finance_id,
      });
      if (!exist) {
        return {
          status: false,
          response: null,
          messages: "Finance record not found",
        };
      }
      if (!params.path.startsWith("https"))
        params.path = (await GenerateImage({ path: params.path })).response;

      const result = await FinanceRepository.updateRepository(
        {
          input_date: params.input_date,
          description: params.description,
          category_code: params.category_code,
          source_id: params.source_id,
          source_table: params.source_table,
          reference: params.reference,
          total: params.total,
          status_code: params.status_code,
          path: params.path,
          updated_at: new Date(),
          updated_by: params.id,
        },
        {
          id: params.finance_id,
        }
      );

      return result;
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }

  // DELETE
  async deleteService(params) {
    try {
      const exist = await FinanceRepository.getOneRepository({
        id: params.finance_id,
      });
      if (!exist) {
        return {
          status: false,
          response: null,
          messages: "Finance record not found",
        };
      }

      await FinanceRepository.updateRepository(
        { deleted_at: new Date(), deleted_by: params.id },
        {
          id: params.finance_id,
        }
      );
      return {
        status: true,
        response: null,
        messages: "Finance record deleted successfully",
      };
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }

  async getAnalyticService(params) {
    try {
      const responsibilities =
        await AdminResponsibilitiesRepository.getAllByAdminIDRepository({
          admin_id: params.id,
        });
      return await FinanceHelper.globalAnalyticResponsibilityHelper({
        ...params,
        responsibilities: responsibilities.response,
      });
    } catch (e) {
      console.log(e);
      return { status: false, response: e, messages: e.message };
    }
  }
}

module.exports = new FinanceService();
