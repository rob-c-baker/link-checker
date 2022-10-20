import Manager from "./manager/manager";

const url = 'https://alanrogers.com';
const manager = new Manager(url);
manager.loggingEvents();
manager.run();