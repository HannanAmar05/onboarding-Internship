import { TResponseData } from "@/commons/types/response";
import { TFaqDetailResponse, TFaqListResponse, TFaqRequest, TFilterFaq } from "./type";

export const getFaqs = (params: TFilterFaq): Promise<TFaqListResponse> => {
  console.log(params);
  return Promise.resolve({
    status_code: 200,
    data: {
      items: [
        {
          id: "1",
          category: "General",
          question: "What is this application for?",
          status: "active",
          answer:
            "This application is a company management system that helps you manage your company data, users, roles, and permissions.",
          created_at: "2023-10-01T00:00:00.000Z",
          updated_at: "2023-10-01T00:00:00.000Z",
          deleted_at: null,
        },
        {
          id: "2",
          category: "Account",
          question: "How do I reset my password?",
          status: "hide",
          answer:
            "You can reset your password by clicking on the 'Forgot Password' link on the login page and following the instructions sent to your email.",
          created_at: "2023-10-01T00:00:00.000Z",
          updated_at: "2023-10-01T00:00:00.000Z",
          deleted_at: null,
        },
      ],
      meta: {
        total_page: 1,
        total: 2,
        page: 1,
        per_page: 10,
      },
    },
    version: "1.0.0",
  });
};

export const getDetailFaq = (params: { id: string }): Promise<TFaqDetailResponse> => {
  console.log(params);
  return Promise.resolve({
    status_code: 200,
    data: {
      id: "1",
      category: "General",
      question: "What is this application for?",
      status: "active",
      answer:
        "This application is a company management system that helps you manage your company data, users, roles, and permissions.",
      created_at: "2023-10-01T00:00:00.000Z",
      updated_at: "2023-10-01T00:00:00.000Z",
      deleted_at: null,
    },
    version: "1.0.0",
  });
};

export const deleteFaq = (params: { id: string }): Promise<TResponseData<null>> => {
  console.log(params);
  return Promise.resolve({
    status_code: 200,
    data: null,
    version: "1.0.0",
  });
};

export const createFaq = (req: TFaqRequest): Promise<TResponseData<null>> => {
  console.log(req);
  return Promise.resolve({
    status_code: 200,
    data: null,
    version: "1.0.0",
  });
};

export const updateFaq = (
  params: { id: string },
  req: TFaqRequest,
): Promise<TResponseData<null>> => {
  console.log(req, params);
  return Promise.resolve({
    status_code: 200,
    data: null,
    version: "1.0.0",
  });
};
