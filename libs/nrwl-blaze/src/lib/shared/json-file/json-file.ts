import { writeFileSync, existsSync, readFileSync } from 'fs';

export class JsonFile {
  data = {} as any;
  constructor(private path: string, template?: any) {
    this.open(template);
  }

  private open(template = {}) {
    if (!existsSync(this.path)) {
      console.log(`${this.path} does not exist, creating...`);
      this.data = template;
      this.save();
    }
    this.data = JSON.parse(readFileSync(this.path, 'utf-8'))
  }

  save() {
    writeFileSync(this.path, JSON.stringify(this.data, null, 2));
    return this;
  }
}
