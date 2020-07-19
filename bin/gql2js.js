#! /usr/bin/env node
const program = require('commander');
const pkg = require('../package.json');
const gq = require('graphql');
const g2j = require('../dist');
const fs = require('fs');
const fp = require('path');
const util = require('util');
const globby = require('globby');
const os = require('os');
const mkdirp = require('make-dir');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

program
  .version(pkg.version)
  .arguments('<source>')
  .option('-o, --output <file>', 'Output file')
  .option('-d, --output-dir <dir>', 'Output directory')
  .option('--dry-run', 'Dry run. Do not write files')
  .description('Converts GrapqhQL to JSON schema')
  .action(handler);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  return;
}

program.parse(process.argv);

// gql2js -o dir/ 'lib/*.gql' 'others'

async function handler(source, flags) {
  try {
    if (!source) {
      program.help();
    }
    const sources = [source, ...flags.args];
    const paths = await globby(sources);
    let dryRun = flags.dryRun;

    if (paths.length === 0) {
      process.stderr.write(`No files found matching: ${sources}`);
      process.exit(1);
    }

    if (paths.length === 1) {
      let outputFile = flags.output;
      if (!outputFile) {
        dryRun = true;
      }
      const path = paths[0];
      await processFile(path, outputFile, { dryRun, printHeader: false });
      return;
    }

    const outputDir = flags.outputDir;
    if (!outputDir) {
      throw new Error(
        'Multiple files found, --output-dir must be a valid directory'
      );
    }

    const dir = fs.statSync(outputDir);
    if (!dir.isDirectory()) {
      throw new Error('--output-dir is not a directory');
    }

    for (const path of paths) {
      const relDir = fp.relative(process.cwd(), fp.resolve(path));
      const parts = fp.dirname(relDir).split(fp.sep);
      const newFilename = fp.basename(path, fp.extname(path)) + '.json';
      const outputFile = fp.join(outputDir, ...parts.slice(1), newFilename);
      await mkdirp(fp.dirname(outputFile));
      await processFile(path, outputFile, {
        dryRun: flags.dryRun,
        printHeader: true,
      });
    }
  } catch (err) {
    process.stderr.write(err.message);
    process.stderr.write(err.stack);
    process.exit(1);
  }
}

async function processFile(
  graphqlFilename,
  outputFilename,
  { dryRun, printHeader }
) {
  try {
    const jsonSchema = await tranformGraphqQLFile(graphqlFilename);

    if (dryRun) {
      if (printHeader) {
        process.stdout.write(`\n`);
        process.stdout.write(`// ----------------------------------------\n`);
        process.stdout.write(`// input:  ${graphqlFilename}\n`);
        process.stdout.write(`// output: ${outputFilename}\n`);
        process.stdout.write(`// ----------------------------------------\n`);
        process.stdout.write(`\n`);
      }
      process.stdout.write(JSON.stringify(jsonSchema, null, 2));
      process.stdout.write('\n');
      return;
    }

    await writeFile(outputFilename, JSON.stringify(jsonSchema, null, 2));
  } catch (err) {
    process.stderr.write(`grapqlFilename: ${graphqlFilename}`);
    process.stderr.write(`outputFilename: ${outputFilename}`);
    throw err;
  }
}

/**
 * Transforms a GraphQL schema file to JSON schema.
 *
 * @param filename GraphQL file
 * .
 */
async function tranformGraphqQLFile(filename) {
  const schemaText = await readFile(filename, 'utf-8');
  const schema = gq.buildSchema(schemaText);
  const introspection = await gq.graphql(schema, gq.getIntrospectionQuery());
  return g2j.fromIntrospectionQuery(introspection.data);
}
