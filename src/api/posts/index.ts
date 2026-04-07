import { TResponseData } from "@/commons/types/response";
import {
  TFaq,
  TFaqDetailResponse,
  TFaqListResponse,
  TFaqRequest,
  TFaqStatus,
  TFilterFaq,
} from "./type";
import { api } from "@/libs/axios/api";
import { ROUTES } from "@/commons/constants/routes";

const mapPost = (post: TFaq): TFaq => {
  const id = Number(post.id);
  const hash = (id * 1618033) % 1000;

  const categories = ["Technical", "General", "Account"];
  const category = categories[hash % categories.length];
  const status: TFaqStatus = hash % 2 === 0 ? "hide" : "active";

  const generateRandomContacts = () => {
    const contactType = ["Home", "Work", "Mobile"];
    const count = (id % 2) + 1;
    const mockContacts = []

    for (let i = 0; i < count; i++) {
      const type = contactType[(hash + i) % contactType.length];
      const phone_number = `0812${(id * 1234 + i).toString().padEnd(8, "0").substring(0, 8)}`;
      mockContacts.push({ type, phone_number });
    }
    return mockContacts;
  };

  return {
    id: post.id.toString(),
    category: post.category || category,
    title: post.title,
    body: post.body,
    status: post.status || status,
    valid_date: post.valid_date || new Date().toISOString(),
    contacts: post.contacts && post.contacts.length > 0 ? post.contacts : generateRandomContacts(),
    created_at: post.created_at || new Date().toISOString(),
    updated_at: post.updated_at || new Date().toISOString(),
    deleted_at: post.deleted_at || null,
  };
};

export const getFaqs = async (params: TFilterFaq): Promise<TFaqListResponse> => {
  const response = await api.get(ROUTES.post.list, {
    params: {
      _page: params.page || 1,
      _limit: params.per_page || 5,
    },
  });

  const totalDataServer = Number(response.headers["x-total-count"]) || 0;
  const limit = params.per_page || 6;

  return {
    status_code: 200,
    data: {
      items: response.data.map(mapPost),
      meta: {
        total_page: Math.ceil(totalDataServer / limit),
        total: totalDataServer,
        page: params.page || 1,
        per_page: limit,
      },
    },
    version: "1.0.0",
  };
};

export const getDetailFaq = async (params: { id: string }): Promise<TFaqDetailResponse> => {
  const response = await api.get(`${ROUTES.post.list}/${params.id}`);

  return {
    status_code: 200,
    data: mapPost(response.data),
    version: "1.0.0",
  };
};

export const deleteFaq = async (params: { id: string }): Promise<TResponseData<null>> => {
  const response = await api.delete(`${ROUTES.post.list}/${params.id}`);
  return response.data;
};

export const createFaq = async (req: TFaqRequest): Promise<TResponseData<TFaq>> => {
  const response = await api.post(ROUTES.post.list, {
    title: req.question,
    body: req.answer,
    userId: 1,
    category: req.category,
    status: req.status,
    valid_date: req.valid_date,
    contacts: req.contacts,
  });

  return {
    status_code: 201,
    data: mapPost(response.data),
    version: "1.0.0",
  };
};

export const updateFaq = async (
  params: { id: string },
  req: TFaqRequest,
): Promise<TResponseData<TFaq>> => {
  const response = await api.put(`${ROUTES.post.list}/${params.id}`, {
    id: params.id,
    title: req.question,
    category: req.category,
    status: req.status,
    valid_date: req.valid_date,
    body: req.answer,
    userId: 1,
    contacts: req.contacts,
  });

  return {
    status_code: 200,
    data: mapPost(response.data),
    version: "1.0.0",
  };
};
