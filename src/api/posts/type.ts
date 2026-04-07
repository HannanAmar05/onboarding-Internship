import { TFilterParams } from "@/commons/types/filter";
import { TResponseData, TResponsePaginate } from "@/commons/types/response";

export type TFaqStatus = "active" | "hide";
export type TContact = {
  type: string;
  phone_number: string;
};

export type TFaq = {
  id: string;
  category: string;
  title: string;
  body: string;
  status: TFaqStatus;
  contacts?: TContact[];
  valid_date: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type TFaqRequest = {
  category: string;
  question: string;
  answer: string;
  status?: TFaqStatus;
  valid_date: string;
  contacts?: TContact[]; 
};

export type TFilterFaq = TFilterParams<{ category?: string }>;
export type TFaqListResponse = TResponsePaginate<TFaq>;
export type TFaqDetailResponse = TResponseData<TFaq>;
