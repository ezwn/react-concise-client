import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useCallback } from "react";
import { createBroadcastContext } from "react-concise";

export interface ApiClientConfig extends AxiosRequestConfig {}

export type ApiClientConfigMap = { [key: string]: ApiClientConfig };

const apiClientContext = createBroadcastContext<{ configMap: ApiClientConfigMap }>();

export const ApiClientProvider = apiClientContext.Provider;

interface AxiosExtension {
    exchange: <M, R>(path: string, message: M) => Promise<R>;
}

declare module 'axios' {
    export interface AxiosInstance extends AxiosExtension { }
}

export type ApiClient = AxiosInstance;

let axiosInstances: { [key: string]: ApiClient } = {};

export const createApiClient = (config: ApiClientConfig): ApiClient => {
    const key = JSON.stringify(config);
    if (axiosInstances[key]) {
        return axiosInstances[key];
    }

    const axiosInstance = axios.create(config);
    axiosInstance.exchange = async <M, R>(path: string, message: M): Promise<R> => {
        try {
            const response = await axiosInstance.post(path, message);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    axiosInstances[key] = axiosInstance;
    return axiosInstance;
}

export const useGetApiClientConfig = () => {
    const configMap = apiClientContext.useContext().configMap;

    return useCallback((key: string) => {
        const config = configMap[key];

        if (!config) {
            throw (new Error(`useGetApiClientConfig has been called with a key ${key} for which no client is defined.`));
        }
    
        return config;
    }, [configMap]);
}

export const useGetApiClient = () => {
    const getApiClientConfig = useGetApiClientConfig();;

    return useCallback((key: string) => {
        const config = getApiClientConfig(key);
        return createApiClient(config)
    }, [getApiClientConfig]);
}
