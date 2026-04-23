export class Message {
  id: string;

  properties: any;

  messageId: string;

  constructor(id: string) {
    this.id = id;
    this.properties = {};
    const { v4: uuidv4 } = require("uuid");
    this.messageId = uuidv4();
  }

  addData(key: any, value: any) {
    this.properties[key] = value;
  }

  getData(key: any) {
    if (Object.prototype.hasOwnProperty.call(this.properties, key)) {
      return this.properties[key];
    }
    console.log('properties = ', this.properties, key);
    return undefined;
  }

  initializeFromObject = (from: any) => {
    this.properties = { ...this.properties, ...from };
  };

  copyAllPropertiesOf(from: Message) {
    Object.entries(from.properties).map(([key, value]) => {
      return this.addData(key, value);
    });
  }
}
