/**
* !!! DO NOT EDIT THIS FILE DIRECTLY !!!
* ! This file has been generated automatically. See the *.babel.js version of
* ! this file to make permanent modifications (in config/)
*/

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanTypes = exports.regenerate = exports.eject = void 0;

require("source-map-support/register");

var _fs = require("fs");

var _util = require("util");

var _gulp = _interopRequireDefault(require("gulp"));

var _gulpTap = _interopRequireDefault(require("gulp-tap"));

var _del = _interopRequireDefault(require("del"));

var _fancyLog = _interopRequireDefault(require("fancy-log"));

var _parseGitignore = _interopRequireDefault(require("parse-gitignore"));

var _core = require("@babel/core");

var _path = require("path");

var _inquirer = _interopRequireDefault(require("inquirer"));

var _replaceInFile = _interopRequireDefault(require("replace-in-file"));

var _shelljs = _interopRequireDefault(require("shelljs"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_shelljs.default.config.silent = true;
_shelljs.default.config.fatal = true;
const paths = {};
const FLOW_TYPES_DIR = 'flow-typed';
paths.flowTypedGitIgnore = `${FLOW_TYPES_DIR}/.gitignore`;
paths.configs = 'config';
paths.packageJson = 'package.json';
paths.launchJson = '.vscode/launch.json';
paths.launchJsonDist = '.vscode/launch.dist.json';
paths.env = '.env';
paths.envDist = 'dist.env';
paths.gitProjectDir = '.git';
paths.gitIgnore = '.gitignore';
paths.packageLockJson = 'package-lock.json';
paths.regenTargets = [`${paths.configs}/*.js`];
const CLI_BANNER = `/**
* !!! DO NOT EDIT THIS FILE DIRECTLY !!!
* ! This file has been generated automatically. See the *.babel.js version of
* ! this file to make permanent modifications (in config/)
*/\n\n`;
const readFileAsync = (0, _util.promisify)(_fs.readFile);

const cleanTypes = async () => {
  const targets = (0, _parseGitignore.default)((await readFileAsync(paths.flowTypedGitIgnore)));
  (0, _fancyLog.default)(`Deletion targets @ ${FLOW_TYPES_DIR}/: "${targets.join('" "')}"`);
  (0, _del.default)(targets, {
    cwd: FLOW_TYPES_DIR
  });
};

exports.cleanTypes = cleanTypes;
cleanTypes.description = `Resets the ${FLOW_TYPES_DIR} directory to a pristine state`;

const regenerate = () => {
  (0, _fancyLog.default)(`Regenerating targets: "${paths.regenTargets.join('" "')}"`);
  process.env.BABEL_ENV = 'generator';
  return _gulp.default.src(paths.regenTargets).pipe((0, _gulpTap.default)(file => file.contents = Buffer.from(CLI_BANNER + (0, _core.transformSync)(file.contents.toString(), {
    sourceFileName: (0, _path.relative)(__dirname, file.path)
  }).code))).pipe(_gulp.default.dest('.'));
};

exports.regenerate = regenerate;
regenerate.description = 'Invokes babel on the files in config, transpiling them into their project root versions';

const eject = () => _inquirer.default.prompt([{
  type: 'input',
  name: 'package.name',
  message: '[package.json] Specify name for this project (must be valid as a directory name)'
}, {
  type: 'input',
  name: 'package.desc',
  message: '[package.json] Very briefly describe this project'
}, {
  type: 'input',
  name: 'package.repo.url',
  message: '[package.json] Specify a git repository URL'
}, {
  type: 'input',
  name: 'debug.address',
  message: '[launch.json] Specify your dev/remote/server ip address (the one running node)',
  default: '192.168.115.5'
}, {
  type: 'input',
  name: 'debug.url',
  message: '[launch.json] Specify the URL entry point for your application',
  default: 'http://dev.local:80'
}, {
  type: 'input',
  name: 'debug.remoteRoot',
  message: "[launch.json] Specify an *absolute* path to this project's root on remote/server"
}, {
  type: 'confirm',
  name: 'installTypes',
  message: 'Do you want to install Flow types for all local packages?',
  default: true
}, {
  type: 'confirm',
  name: 'confirm',
  message: 'Does everything look good?',
  default: false
}]).then(async answers => {
  if (!answers.confirm) return _fancyLog.default.error('Task aborted!');

  try {
    _fancyLog.default.info(`Moving ${paths.envDist} -> ${paths.env}`);

    _shelljs.default.mv(paths.envDist, paths.env);

    _fancyLog.default.info(`Moving ${paths.launchJsonDist} -> ${paths.launchJson}`);

    _shelljs.default.mv(paths.launchJsonDist, paths.launchJson);

    _fancyLog.default.info(`Mutating ${paths.packageJson}`);

    const delta1 = await (0, _replaceInFile.default)({
      files: paths.packageJson,
      from: [/("name": ?)".*?"/g, /("description": ?)".*?"/g, /("url": ?)".*?"/g],
      to: [`$1"${answers.package.name}"`, `$1"${answers.package.desc}"`, `$1"${answers.package.repo.url}"`]
    });

    _fancyLog.default.info(`Mutating ${paths.launchJson}`);

    const delta2 = await (0, _replaceInFile.default)({
      files: paths.launchJson,
      from: [/("address": ?)".*?"/g, /("remoteRoot": ?)".*?"/g, /("url": ?)".*?"/g],
      to: [`$1"${answers.debug.address}"`, `$1"${answers.debug.remoteRoot}"`, `$1"${answers.debug.url}"`]
    });

    _fancyLog.default.info(`Mutating ${paths.gitIgnore}`);

    const delta3 = await (0, _replaceInFile.default)({
      files: paths.gitIgnore,
      from: 'package-lock.json',
      to: ''
    });
    if (!delta1.length) throw new Error(`There was an error attempting to access "${paths.packageJson}"`);
    if (!delta2.length) throw new Error(`There was an error attempting to access "${paths.launchJson}"`);
    if (!delta3.length) throw new Error(`There was an error attempting to access "${paths.gitignore}"`);

    if (answers.installTypes) {
      _fancyLog.default.info(`Installing flow types (please be patient)`);

      _shelljs.default.exec('npm run install-types');
    }

    _fancyLog.default.info(`Removing ${paths.packageLockJson}`);

    _shelljs.default.rm('-f', paths.packageLockJson);

    _fancyLog.default.info('Removing boilerplate git repository');

    _shelljs.default.rm('-rf', '.git');

    _fancyLog.default.info('Initializing new git repository');

    _shelljs.default.exec('git init');

    _fancyLog.default.info(`Renaming project dir to ${answers.package.name}`);

    _shelljs.default.exec(`cd .. && mv '${(0, _path.parse)(__dirname).name}' '${answers.package.name}'`);

    _fancyLog.default.info(_chalk.default.green('Boilerplate ejection completed successfully!'));

    (0, _fancyLog.default)(`Next steps:\n\t- If you're going to host this project on Github/Gitlab, begin that process now\n\t- Check over package.json for accuracy; remove any unnecessary dependencies/devDependencies\n\t- Check over your vscode launch configuration if you plan on using it\n\t- Look over .env and configure it to your liking\n`);
  } catch (err) {
    _fancyLog.default.error(_chalk.default.red(`ERROR: ${err.toString()}`));
  }
});

exports.eject = eject;
eject.description = 'Assists in configuring the boilerplate to be something useful';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy9ndWxwZmlsZS5qcyJdLCJuYW1lcyI6WyJzaCIsImNvbmZpZyIsInNpbGVudCIsImZhdGFsIiwicGF0aHMiLCJGTE9XX1RZUEVTX0RJUiIsImZsb3dUeXBlZEdpdElnbm9yZSIsImNvbmZpZ3MiLCJwYWNrYWdlSnNvbiIsImxhdW5jaEpzb24iLCJsYXVuY2hKc29uRGlzdCIsImVudiIsImVudkRpc3QiLCJnaXRQcm9qZWN0RGlyIiwiZ2l0SWdub3JlIiwicGFja2FnZUxvY2tKc29uIiwicmVnZW5UYXJnZXRzIiwiQ0xJX0JBTk5FUiIsInJlYWRGaWxlQXN5bmMiLCJyZWFkRmlsZSIsImNsZWFuVHlwZXMiLCJ0YXJnZXRzIiwiam9pbiIsImN3ZCIsImRlc2NyaXB0aW9uIiwicmVnZW5lcmF0ZSIsInByb2Nlc3MiLCJCQUJFTF9FTlYiLCJndWxwIiwic3JjIiwicGlwZSIsImZpbGUiLCJjb250ZW50cyIsIkJ1ZmZlciIsImZyb20iLCJ0b1N0cmluZyIsInNvdXJjZUZpbGVOYW1lIiwiX19kaXJuYW1lIiwicGF0aCIsImNvZGUiLCJkZXN0IiwiZWplY3QiLCJ0ZXJtIiwicHJvbXB0IiwidHlwZSIsIm5hbWUiLCJtZXNzYWdlIiwiZGVmYXVsdCIsInRoZW4iLCJhbnN3ZXJzIiwiY29uZmlybSIsImxvZyIsImVycm9yIiwiaW5mbyIsIm12IiwiZGVsdGExIiwiZmlsZXMiLCJ0byIsInBhY2thZ2UiLCJkZXNjIiwicmVwbyIsInVybCIsImRlbHRhMiIsImRlYnVnIiwiYWRkcmVzcyIsInJlbW90ZVJvb3QiLCJkZWx0YTMiLCJsZW5ndGgiLCJFcnJvciIsImdpdGlnbm9yZSIsImluc3RhbGxUeXBlcyIsImV4ZWMiLCJybSIsImNoYWxrIiwiZ3JlZW4iLCJlcnIiLCJyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQVNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7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LElBQUssR0FBNUU7O0FBRUFNLHNCQUFJRSxJQUFKLENBQVNvQixlQUFNQyxLQUFOLENBQVksOENBQVosQ0FBVDs7QUFDQSwyQkFBSyw4VEFBTDtBQUNILEdBekRELENBMkRBLE9BQU1DLEdBQU4sRUFBVztBQUNQeEIsc0JBQUlDLEtBQUosQ0FBVXFCLGVBQU1HLEdBQU4sQ0FBVyxVQUFTRCxHQUFHLENBQUN4QyxRQUFKLEVBQWUsRUFBbkMsQ0FBVjtBQUNIO0FBQ0osQ0EvR21CLENBQXBCOzs7QUFpSEFNLEtBQUssQ0FBQ2pCLFdBQU4sR0FBb0IsK0RBQXBCIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuLy8gPyBUbyByZWdlbmVyYXRlIHRoaXMgZmlsZSAoaS5lLiBpZiB5b3UgY2hhbmdlZCBpdCBhbmQgd2FudCB5b3VyIGNoYW5nZXMgdG9cbi8vID8gYmUgcGVybWFuZW50KSwgY2FsbCBgbnBtIHJ1biByZWdlbmVyYXRlYCBhZnRlcndhcmRzXG5cbi8vICEgQmUgc3VyZSB0aGF0IHRhc2tzIGV4cGVjdGVkIHRvIHJ1biBvbiBucG0gaW5zdGFsbCAobWFya2VkIEBkZXBlbmRlbnQpIGhhdmVcbi8vICEgYWxsIHJlcXVpcmVkIHBhY2thZ2VzIGxpc3RlZCB1bmRlciBcImRlcGVuZGVuY2llc1wiIGluc3RlYWQgb2Zcbi8vICEgXCJkZXZEZXBlbmRlbmNpZXNcIiBpbiB0aGlzIHByb2plY3QncyBwYWNrYWdlLmpzb25cblxuaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tICdmcydcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnXG5pbXBvcnQgZ3VscCBmcm9tICdndWxwJ1xuaW1wb3J0IHRhcCBmcm9tICdndWxwLXRhcCdcbmltcG9ydCBkZWwgZnJvbSAnZGVsJ1xuaW1wb3J0IGxvZyBmcm9tICdmYW5jeS1sb2cnXG5pbXBvcnQgcGFyc2VHaXRJZ25vcmUgZnJvbSAncGFyc2UtZ2l0aWdub3JlJ1xuaW1wb3J0IHsgdHJhbnNmb3JtU3luYyBhcyBiYWJlbCB9IGZyb20gJ0BiYWJlbC9jb3JlJ1xuaW1wb3J0IHsgcGFyc2UgYXMgcGFyc2VQYXRoLCByZWxhdGl2ZSBhcyByZWxQYXRoIH0gZnJvbSAncGF0aCdcbmltcG9ydCB0ZXJtIGZyb20gJ2lucXVpcmVyJ1xuaW1wb3J0IHJlcGxhY2VJbkZpbGUgZnJvbSAncmVwbGFjZS1pbi1maWxlJ1xuaW1wb3J0IHNoIGZyb20gJ3NoZWxsanMnXG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnXG5cbnNoLmNvbmZpZy5zaWxlbnQgPSB0cnVlO1xuc2guY29uZmlnLmZhdGFsID0gdHJ1ZTtcblxuY29uc3QgcGF0aHMgPSB7fTtcbmNvbnN0IEZMT1dfVFlQRVNfRElSID0gJ2Zsb3ctdHlwZWQnO1xuXG5wYXRocy5mbG93VHlwZWRHaXRJZ25vcmUgPSBgJHtGTE9XX1RZUEVTX0RJUn0vLmdpdGlnbm9yZWA7XG5wYXRocy5jb25maWdzID0gJ2NvbmZpZyc7XG5wYXRocy5wYWNrYWdlSnNvbiA9ICdwYWNrYWdlLmpzb24nO1xucGF0aHMubGF1bmNoSnNvbiA9ICcudnNjb2RlL2xhdW5jaC5qc29uJztcbnBhdGhzLmxhdW5jaEpzb25EaXN0ID0gJy52c2NvZGUvbGF1bmNoLmRpc3QuanNvbic7XG5wYXRocy5lbnYgPSAnLmVudic7XG5wYXRocy5lbnZEaXN0ID0gJ2Rpc3QuZW52JztcbnBhdGhzLmdpdFByb2plY3REaXIgPSAnLmdpdCc7XG5wYXRocy5naXRJZ25vcmUgPSAnLmdpdGlnbm9yZSc7XG5wYXRocy5wYWNrYWdlTG9ja0pzb24gPSAncGFja2FnZS1sb2NrLmpzb24nO1xuXG5wYXRocy5yZWdlblRhcmdldHMgPSBbXG4gICAgYCR7cGF0aHMuY29uZmlnc30vKi5qc2Bcbl07XG5cbmNvbnN0IENMSV9CQU5ORVIgPSBgLyoqXG4qICEhISBETyBOT1QgRURJVCBUSElTIEZJTEUgRElSRUNUTFkgISEhXG4qICEgVGhpcyBmaWxlIGhhcyBiZWVuIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5LiBTZWUgdGhlICouYmFiZWwuanMgdmVyc2lvbiBvZlxuKiAhIHRoaXMgZmlsZSB0byBtYWtlIHBlcm1hbmVudCBtb2RpZmljYXRpb25zIChpbiBjb25maWcvKVxuKi9cXG5cXG5gO1xuXG5jb25zdCByZWFkRmlsZUFzeW5jID0gcHJvbWlzaWZ5KHJlYWRGaWxlKTtcblxuLy8gKiBDTEVBTlRZUEVTXG5cbmNvbnN0IGNsZWFuVHlwZXMgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0cyA9IHBhcnNlR2l0SWdub3JlKGF3YWl0IHJlYWRGaWxlQXN5bmMocGF0aHMuZmxvd1R5cGVkR2l0SWdub3JlKSk7XG5cbiAgICBsb2coYERlbGV0aW9uIHRhcmdldHMgQCAke0ZMT1dfVFlQRVNfRElSfS86IFwiJHt0YXJnZXRzLmpvaW4oJ1wiIFwiJyl9XCJgKTtcbiAgICBkZWwodGFyZ2V0cywgeyBjd2Q6IEZMT1dfVFlQRVNfRElSIH0pO1xufTtcblxuY2xlYW5UeXBlcy5kZXNjcmlwdGlvbiA9IGBSZXNldHMgdGhlICR7RkxPV19UWVBFU19ESVJ9IGRpcmVjdG9yeSB0byBhIHByaXN0aW5lIHN0YXRlYDtcblxuLy8gKiBSRUdFTkVSQVRFXG5cbi8vID8gSWYgeW91IGNoYW5nZSB0aGlzIGZ1bmN0aW9uLCBydW4gYG5wbSBydW4gcmVnZW5lcmF0ZWAgdHdpY2U6IG9uY2UgdG9cbi8vID8gY29tcGlsZSB0aGlzIG5ldyBmdW5jdGlvbiBhbmQgb25jZSBhZ2FpbiB0byBjb21waWxlIGl0c2VsZiB3aXRoIHRoZSBuZXdseVxuLy8gPyBjb21waWxlZCBsb2dpYy4gSWYgdGhlcmUgaXMgYW4gZXJyb3IgdGhhdCBwcmV2ZW50cyByZWdlbmVyYXRpb24sIHlvdSBjYW5cbi8vID8gcnVuIGBucG0gcnVuIGdlbmVyYXRlYCB0aGVuIGBucG0gcnVuIHJlZ2VuZXJhdGVgIGluc3RlYWQuXG5jb25zdCByZWdlbmVyYXRlID0gKCkgPT4ge1xuICAgIGxvZyhgUmVnZW5lcmF0aW5nIHRhcmdldHM6IFwiJHtwYXRocy5yZWdlblRhcmdldHMuam9pbignXCIgXCInKX1cImApO1xuXG4gICAgcHJvY2Vzcy5lbnYuQkFCRUxfRU5WID0gJ2dlbmVyYXRvcic7XG5cbiAgICByZXR1cm4gZ3VscC5zcmMocGF0aHMucmVnZW5UYXJnZXRzKVxuICAgICAgICAgICAgICAgLnBpcGUodGFwKGZpbGUgPT4gZmlsZS5jb250ZW50cyA9IEJ1ZmZlci5mcm9tKENMSV9CQU5ORVIgKyBiYWJlbChmaWxlLmNvbnRlbnRzLnRvU3RyaW5nKCksIHtcbiAgICAgICAgICAgICAgICAgICBzb3VyY2VGaWxlTmFtZTogcmVsUGF0aChfX2Rpcm5hbWUsIGZpbGUucGF0aClcbiAgICAgICAgICAgICAgIH0pLmNvZGUpKSlcbiAgICAgICAgICAgICAgIC5waXBlKGd1bHAuZGVzdCgnLicpKTtcbn07XG5cbnJlZ2VuZXJhdGUuZGVzY3JpcHRpb24gPSAnSW52b2tlcyBiYWJlbCBvbiB0aGUgZmlsZXMgaW4gY29uZmlnLCB0cmFuc3BpbGluZyB0aGVtIGludG8gdGhlaXIgcHJvamVjdCByb290IHZlcnNpb25zJztcblxuLy8gKiBFSkVDVFxuXG5jb25zdCBlamVjdCA9ICgpID0+IHRlcm0ucHJvbXB0KFtcbiAgICB7XG4gICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgIG5hbWU6ICdwYWNrYWdlLm5hbWUnLFxuICAgICAgICBtZXNzYWdlOiAnW3BhY2thZ2UuanNvbl0gU3BlY2lmeSBuYW1lIGZvciB0aGlzIHByb2plY3QgKG11c3QgYmUgdmFsaWQgYXMgYSBkaXJlY3RvcnkgbmFtZSknXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgIG5hbWU6ICdwYWNrYWdlLmRlc2MnLFxuICAgICAgICBtZXNzYWdlOiAnW3BhY2thZ2UuanNvbl0gVmVyeSBicmllZmx5IGRlc2NyaWJlIHRoaXMgcHJvamVjdCcsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgIG5hbWU6ICdwYWNrYWdlLnJlcG8udXJsJyxcbiAgICAgICAgbWVzc2FnZTogJ1twYWNrYWdlLmpzb25dIFNwZWNpZnkgYSBnaXQgcmVwb3NpdG9yeSBVUkwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgIG5hbWU6ICdkZWJ1Zy5hZGRyZXNzJyxcbiAgICAgICAgbWVzc2FnZTogJ1tsYXVuY2guanNvbl0gU3BlY2lmeSB5b3VyIGRldi9yZW1vdGUvc2VydmVyIGlwIGFkZHJlc3MgKHRoZSBvbmUgcnVubmluZyBub2RlKScsXG4gICAgICAgIGRlZmF1bHQ6ICcxOTIuMTY4LjExNS41J1xuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICBuYW1lOiAnZGVidWcudXJsJyxcbiAgICAgICAgbWVzc2FnZTogJ1tsYXVuY2guanNvbl0gU3BlY2lmeSB0aGUgVVJMIGVudHJ5IHBvaW50IGZvciB5b3VyIGFwcGxpY2F0aW9uJyxcbiAgICAgICAgZGVmYXVsdDogJ2h0dHA6Ly9kZXYubG9jYWw6ODAnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgIG5hbWU6ICdkZWJ1Zy5yZW1vdGVSb290JyxcbiAgICAgICAgbWVzc2FnZTogXCJbbGF1bmNoLmpzb25dIFNwZWNpZnkgYW4gKmFic29sdXRlKiBwYXRoIHRvIHRoaXMgcHJvamVjdCdzIHJvb3Qgb24gcmVtb3RlL3NlcnZlclwiXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdjb25maXJtJyxcbiAgICAgICAgbmFtZTogJ2luc3RhbGxUeXBlcycsXG4gICAgICAgIG1lc3NhZ2U6ICdEbyB5b3Ugd2FudCB0byBpbnN0YWxsIEZsb3cgdHlwZXMgZm9yIGFsbCBsb2NhbCBwYWNrYWdlcz8nLFxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdjb25maXJtJyxcbiAgICAgICAgbmFtZTogJ2NvbmZpcm0nLFxuICAgICAgICBtZXNzYWdlOiAnRG9lcyBldmVyeXRoaW5nIGxvb2sgZ29vZD8nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH1cbl0pLnRoZW4oYXN5bmMgYW5zd2VycyA9PiB7XG4gICAgaWYoIWFuc3dlcnMuY29uZmlybSlcbiAgICAgICAgcmV0dXJuIGxvZy5lcnJvcignVGFzayBhYm9ydGVkIScpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgbG9nLmluZm8oYE1vdmluZyAke3BhdGhzLmVudkRpc3R9IC0+ICR7cGF0aHMuZW52fWApO1xuICAgICAgICBzaC5tdihwYXRocy5lbnZEaXN0LCBwYXRocy5lbnYpO1xuXG4gICAgICAgIGxvZy5pbmZvKGBNb3ZpbmcgJHtwYXRocy5sYXVuY2hKc29uRGlzdH0gLT4gJHtwYXRocy5sYXVuY2hKc29ufWApO1xuICAgICAgICBzaC5tdihwYXRocy5sYXVuY2hKc29uRGlzdCwgcGF0aHMubGF1bmNoSnNvbik7XG5cbiAgICAgICAgbG9nLmluZm8oYE11dGF0aW5nICR7cGF0aHMucGFja2FnZUpzb259YCk7XG4gICAgICAgIGNvbnN0IGRlbHRhMSA9IGF3YWl0IHJlcGxhY2VJbkZpbGUoe1xuICAgICAgICAgICAgZmlsZXM6IHBhdGhzLnBhY2thZ2VKc29uLFxuICAgICAgICAgICAgZnJvbTogWy8oXCJuYW1lXCI6ID8pXCIuKj9cIi9nLCAvKFwiZGVzY3JpcHRpb25cIjogPylcIi4qP1wiL2csIC8oXCJ1cmxcIjogPylcIi4qP1wiL2ddLFxuICAgICAgICAgICAgdG86IFtgJDFcIiR7YW5zd2Vycy5wYWNrYWdlLm5hbWV9XCJgLCBgJDFcIiR7YW5zd2Vycy5wYWNrYWdlLmRlc2N9XCJgLCBgJDFcIiR7YW5zd2Vycy5wYWNrYWdlLnJlcG8udXJsfVwiYF0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxvZy5pbmZvKGBNdXRhdGluZyAke3BhdGhzLmxhdW5jaEpzb259YCk7XG4gICAgICAgIGNvbnN0IGRlbHRhMiA9IGF3YWl0IHJlcGxhY2VJbkZpbGUoe1xuICAgICAgICAgICAgZmlsZXM6IHBhdGhzLmxhdW5jaEpzb24sXG4gICAgICAgICAgICBmcm9tOiBbLyhcImFkZHJlc3NcIjogPylcIi4qP1wiL2csIC8oXCJyZW1vdGVSb290XCI6ID8pXCIuKj9cIi9nLCAvKFwidXJsXCI6ID8pXCIuKj9cIi9nXSxcbiAgICAgICAgICAgIHRvOiBbYCQxXCIke2Fuc3dlcnMuZGVidWcuYWRkcmVzc31cImAsIGAkMVwiJHthbnN3ZXJzLmRlYnVnLnJlbW90ZVJvb3R9XCJgLCBgJDFcIiR7YW5zd2Vycy5kZWJ1Zy51cmx9XCJgXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbG9nLmluZm8oYE11dGF0aW5nICR7cGF0aHMuZ2l0SWdub3JlfWApO1xuICAgICAgICBjb25zdCBkZWx0YTMgPSBhd2FpdCByZXBsYWNlSW5GaWxlKHtcbiAgICAgICAgICAgIGZpbGVzOiBwYXRocy5naXRJZ25vcmUsXG4gICAgICAgICAgICBmcm9tOiAncGFja2FnZS1sb2NrLmpzb24nLFxuICAgICAgICAgICAgdG86ICcnLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZighZGVsdGExLmxlbmd0aClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgd2FzIGFuIGVycm9yIGF0dGVtcHRpbmcgdG8gYWNjZXNzIFwiJHtwYXRocy5wYWNrYWdlSnNvbn1cImApO1xuXG4gICAgICAgIGlmKCFkZWx0YTIubGVuZ3RoKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSB3YXMgYW4gZXJyb3IgYXR0ZW1wdGluZyB0byBhY2Nlc3MgXCIke3BhdGhzLmxhdW5jaEpzb259XCJgKTtcblxuICAgICAgICBpZighZGVsdGEzLmxlbmd0aClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgd2FzIGFuIGVycm9yIGF0dGVtcHRpbmcgdG8gYWNjZXNzIFwiJHtwYXRocy5naXRpZ25vcmV9XCJgKTtcblxuICAgICAgICBpZihhbnN3ZXJzLmluc3RhbGxUeXBlcylcbiAgICAgICAge1xuICAgICAgICAgICAgbG9nLmluZm8oYEluc3RhbGxpbmcgZmxvdyB0eXBlcyAocGxlYXNlIGJlIHBhdGllbnQpYCk7XG4gICAgICAgICAgICBzaC5leGVjKCducG0gcnVuIGluc3RhbGwtdHlwZXMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZy5pbmZvKGBSZW1vdmluZyAke3BhdGhzLnBhY2thZ2VMb2NrSnNvbn1gKTtcbiAgICAgICAgc2gucm0oJy1mJywgcGF0aHMucGFja2FnZUxvY2tKc29uKTtcblxuICAgICAgICBsb2cuaW5mbygnUmVtb3ZpbmcgYm9pbGVycGxhdGUgZ2l0IHJlcG9zaXRvcnknKTtcbiAgICAgICAgc2gucm0oJy1yZicsICcuZ2l0Jyk7XG5cbiAgICAgICAgbG9nLmluZm8oJ0luaXRpYWxpemluZyBuZXcgZ2l0IHJlcG9zaXRvcnknKTtcbiAgICAgICAgc2guZXhlYygnZ2l0IGluaXQnKTtcblxuICAgICAgICBsb2cuaW5mbyhgUmVuYW1pbmcgcHJvamVjdCBkaXIgdG8gJHthbnN3ZXJzLnBhY2thZ2UubmFtZX1gKTtcbiAgICAgICAgc2guZXhlYyhgY2QgLi4gJiYgbXYgJyR7cGFyc2VQYXRoKF9fZGlybmFtZSkubmFtZX0nICcke2Fuc3dlcnMucGFja2FnZS5uYW1lfSdgKTtcblxuICAgICAgICBsb2cuaW5mbyhjaGFsay5ncmVlbignQm9pbGVycGxhdGUgZWplY3Rpb24gY29tcGxldGVkIHN1Y2Nlc3NmdWxseSEnKSk7XG4gICAgICAgIGxvZyhgTmV4dCBzdGVwczpcXG5cXHQtIElmIHlvdSdyZSBnb2luZyB0byBob3N0IHRoaXMgcHJvamVjdCBvbiBHaXRodWIvR2l0bGFiLCBiZWdpbiB0aGF0IHByb2Nlc3Mgbm93XFxuXFx0LSBDaGVjayBvdmVyIHBhY2thZ2UuanNvbiBmb3IgYWNjdXJhY3k7IHJlbW92ZSBhbnkgdW5uZWNlc3NhcnkgZGVwZW5kZW5jaWVzL2RldkRlcGVuZGVuY2llc1xcblxcdC0gQ2hlY2sgb3ZlciB5b3VyIHZzY29kZSBsYXVuY2ggY29uZmlndXJhdGlvbiBpZiB5b3UgcGxhbiBvbiB1c2luZyBpdFxcblxcdC0gTG9vayBvdmVyIC5lbnYgYW5kIGNvbmZpZ3VyZSBpdCB0byB5b3VyIGxpa2luZ1xcbmApO1xuICAgIH1cblxuICAgIGNhdGNoKGVycikge1xuICAgICAgICBsb2cuZXJyb3IoY2hhbGsucmVkKGBFUlJPUjogJHtlcnIudG9TdHJpbmcoKX1gKSk7XG4gICAgfVxufSk7XG5cbmVqZWN0LmRlc2NyaXB0aW9uID0gJ0Fzc2lzdHMgaW4gY29uZmlndXJpbmcgdGhlIGJvaWxlcnBsYXRlIHRvIGJlIHNvbWV0aGluZyB1c2VmdWwnO1xuXG5leHBvcnQgeyBlamVjdCwgcmVnZW5lcmF0ZSwgY2xlYW5UeXBlcyB9O1xuIl19