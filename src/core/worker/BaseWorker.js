/**
 * Created by dannyyassine
 */
const { OperationQueue } = require('operationkit');

class BaseWorker {

  constructor() {
    this.queue = new OperationQueue();
  }
}