import { api } from "@/libs/axios/api";
import { TLoginOidcParam, TLoginParam, TLoginResponse } from "./type";

export const postLogin = async (payload: TLoginParam): Promise<TLoginResponse> => {
  const { data } = await api({
    url: "/auth/login",
    method: "POST",
    data: payload,
  });
  return data;
};

export const postLoginOidc = async (payload: TLoginOidcParam): Promise<TLoginResponse> => {
  const { data } = await api({
    url: "/auth/login",
    method: "POST",
    data: payload,
  });
  return data;
};