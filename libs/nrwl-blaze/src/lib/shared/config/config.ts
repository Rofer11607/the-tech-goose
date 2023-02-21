import {prompt} from 'inquirer'
import { readdirSync,existsSync, writeFileSync, readFileSync } from 'fs';
import {execSync} from 'child_process'
import {JsonFile} from '../json-file/json-file';
import {runCommand} from '../run-command/run-command';

export class Config {
  private _root = '';
  blazeConfig = null as unknown as BlazeConfig;
  apps = null as unknown as CodeDirectory;
  libs = null as unknown as CodeDirectory;

  get firebaserc() {
    return new JsonFile(`${this.root}/.firebaserc`, {
      default: '',
      targets: {}
    });
  }

  get firebaseJson() {
    return new JsonFile(`${this.root}/firebase.json`, {
      functions: {},
      hosting: []
    });
  }

  get root() {
    if (this._root) return this._root;
    this._root = this.findRoot();
    return this._root;
  }

  constructor(private maxDepth = 10) {
    this.blazeConfig = new BlazeConfig(this.root);
    this.apps = new CodeDirectory(this.root, 'apps');
    this.libs = new CodeDirectory(this.root, 'libs');
  }

  async checkForFirebaseDefault() {
    const firebaserc = this.firebaserc;
    if (!firebaserc.data.default) {
      console.log('No default firebase project set, setting now...');
      await this.setDefaultFirebaseProject();
    }
  }

  getFirebaseProjects() {
    console.log('getting firebase projects')
    const projects = execSync('firebase projects:list').toString();
    return projects.split('\n').map(line => {
      const cells = line.split('│')
      if(cells[2]) {
        return cells[2].trim().split('(current)').join('')
      }
      return null
    }).filter(project => !!project).filter(p => p !== 'Project ID')
  }

  async setDefaultFirebaseProject() {
    const {project} = await prompt([
      {
        type: 'list',
        name: 'project',
        message: 'Which Firebase project would you like to use?',
        choices: this.getFirebaseProjects()
      }
    ])
    const firebaserc = this.firebaserc;
    firebaserc.data.default = project;
    firebaserc.save();
    const firebaseJson = this.firebaseJson;
    firebaseJson.save();
    await runCommand(`firebase use ${project}`)
  }

  private findRoot(currentPath = process.cwd(), itt = 0): string {
    const files = readdirSync(currentPath);
    if (files.includes('nx.json')) {
      return currentPath;
    }
    if (itt > this.maxDepth) {
      throw new Error('Unable to find root');
    }
    const newPath = currentPath.split('/');
    newPath.pop();
    return this.findRoot(newPath.join('/'), itt + 1);
  }
}

class CodeDirectory {
  private path = `${this.root}/${this.type}`;
  constructor(private root: string, private type: 'libs' | 'apps') {}

  get allProjects() {
    const files = readdirSync(this.path)
      .filter((f) => !f.includes('.'))
      .map((f) => {
        return `${this.path}/${f}`;
      });

    return {
      type: this.type,
      raw: files,
      filtered: files.filter((f) => !f.includes('e2e')),
    };
  }
}

class BlazeConfig {
  private path = `${this.root}/blaze.config.json`;
  constructor(private root: string) {}

  private createBlazeConfig() {
    writeFileSync(this.path, JSON.stringify({ projects: {} }, null, 2));
  }

  getBlazeConfig() {
    if (!existsSync(this.path)) this.createBlazeConfig();
    const file = readFileSync(this.path, 'utf-8');
    return JSON.parse(file);
  }

  removeFromBlazeConfig(projectName: string) {
    const config = this.getBlazeConfig();
    delete config.projects[projectName];
    writeFileSync(this.path, JSON.stringify(config, null, 2));
  }

  setProject(projectName: string, generator: string) {
    const config = this.getBlazeConfig();
    config.projects[projectName] = generator;
    writeFileSync(this.path, JSON.stringify(config, null, 2));
  }

  setFuctionsProject(projectName: string) {
    const config = this.getBlazeConfig();
    config.functionsProject = projectName;
    writeFileSync(this.path, JSON.stringify(config, null, 2));
  }
}
