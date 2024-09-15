import { Accessor, createEffect, createSignal, For } from "solid-js";
import { render } from "solid-js/web";
import { createCache } from "src/cache";
import LRU from "src/lru";
import Store from "src/store";
import { SwrProvider } from "src/swr";
import useSwrFull, { SwrFullProvider } from "src/swr-full";

function SmolFetcher(props: { key: Accessor<string | undefined> }) {
    const { v, mutate, revalidate } = useSwrFull(() => props.key());

    return (
        <pre>
            isLoading: {v()?.isLoading ? "true" : "false"}
            {"\n"}
            {v().data ? JSON.stringify(v().data) : "{}"}
            <div onClick={revalidate}>click</div>
        </pre>
    );
}

function App() {
    const [counter, setCounter] = createSignal(1);

    const key = () => `https://jsonplaceholder.typicode.com/todos/${counter()}`;

    setInterval(() => {
        setCounter(x => (x + 1) % 10);
    }, 1e3);

    return (
        <SwrProvider
            value={{
                store: new Store(createCache(new LRU(7))),
                fetcher: async key => {
                    return await fetch(key).then(r => r.json());
                },
            }}
        >
            <SwrFullProvider
                value={{
                    keepPreviousData: false,
                }}
            >
                <For each={new Array(1000).fill(0)}>{() => <SmolFetcher key={key} />}</For>
            </SwrFullProvider>
        </SwrProvider>
    );
}

render(() => <App />, document.getElementById("solid-root")!);
