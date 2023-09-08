import { mergeProps, useContext } from "solid-js";

import LRU from "~/classes/lru";
import { SWRConfig } from "~/context/config";
import { CacheItem, Fetcher, Options } from "~/types";
import noop from "~/utils/noop";

const defaultFetcher: Fetcher<unknown> = async (key, { signal }) => {
    const response = await fetch(key, { signal });
    const json = (await response.json()) as unknown;

    if (response.ok) {
        return json;
    }

    throw new Error(JSON.stringify(json));
};

const cache = new LRU<string, CacheItem<unknown>>(5e3);

export default function useOptions<Res, Err>(
    options: Options<Res, Err>
): Required<Options<Res, Err>> {
    const context = useContext(SWRConfig);

    const merged = mergeProps(
        {
            fetcher: defaultFetcher,
            keepPreviousData: false,
            isEnabled: true,
            autoRevalidate: true,
            refreshInterval: 0,
            cache,
            onSuccess: noop,
            onError: noop,
        } satisfies Required<Options<unknown, unknown>>,
        context,
        options
    );

    return merged as Required<Options<Res, Err>>;
}
