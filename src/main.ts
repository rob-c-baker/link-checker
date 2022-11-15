import Manager from "./manager/manager.js";

export default function (start_url: string)
{
    (async () => {
        const manager = new Manager(start_url);
        manager.init();
        return manager.run();
    })();
}