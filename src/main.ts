import Manager from "./manager/manager";

// to debug EventEmitter potential memory leak
process.on('warning', e => console.warn(e.stack));

(async () => {
    const url = 'https://alanrogers.com';
    const manager = new Manager(url);
    manager.init();
    await manager.run();
})();