import { expect, it, jest } from "@jest/globals";
import { renderHook } from "@solidjs/testing-library";

import useSWR from "../lib";

import createKey from "./utils/createKey";
import waitForMs from "./utils/waitForMs";

it("sets new value instantly and respects revalidation option", async () => {
    const fetcher = jest.fn(async (x: string) => {
        await waitForMs();
        return x;
    });

    const [key] = createKey();

    const { result } = renderHook(useSWR, [key, { fetcher }]);

    await waitForMs();
    expect(result.data()).toBe(key());
    expect(fetcher).toBeCalledTimes(1);

    result.mutate("foo", { revalidate: true });
    expect(result.data()).toBe("foo");
    expect(fetcher).toBeCalledTimes(2);

    await waitForMs();

    result.mutate("bar", { revalidate: false });
    expect(result.data()).toBe("bar");
    expect(fetcher).toBeCalledTimes(2);
});
