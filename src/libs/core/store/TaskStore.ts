import { StoreTaskRecord } from '../../modal/store/StoreTaskRecord';

export class TaskStore {
  private taskStore: StoreTaskRecord[];

  constructor(taskStore: StoreTaskRecord[]) {
    this.taskStore = taskStore;
  }

  getTaskStore(): StoreTaskRecord[] {
    return this.taskStore;
  }

  addNewRecord(record: StoreTaskRecord) {
    this.taskStore.push(record);
  }

  findRecord(infoHash?: string, name?: string) {
    if (infoHash) {
      return this.taskStore.find((record) => record.infoHash === infoHash);
    }

    if (name) {
      return this.taskStore.find((record) => record.infoHash === name);
    }
  }
}
