/**
 * Created by dannyyassine
 */
const { OperationQueue, BlockOperation } = require('operationkit');

class BaseWorker {

  constructor() {
    this.operations = [];
    this.operation = new BlockOperation(() => {});
  }

  setSequenceOperations(operations) {

  }

  setOperations(operations) {
    this.operations = operations;
  }

  async execute() {
    this.main();
    this.operation.dependencies = this.operations;
    return this.operation.start();
  }

  /**
   * @abstract
   */
  main() {
    throw 'Must be implemented';
  }
}

module.exports = {
  BaseWorker
};