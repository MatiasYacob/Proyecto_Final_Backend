import { Command } from "commander";
import { Devlogger } from "./config/logger_CUSTOM";
const program = new Command();

program
    .option('-d','Variable para debug', false)
    .option('-p <port>','Puerto del Servidor', 8080)
    .option('--mode <mode>', 'Mode de trabajo', 'develop')

    .requiredOption('-u <user>', 'Usuario que va a utiliuzar el aplicativo', 'No se ha declarado un usuario.')



program.parse();

Devlogger.info("Options:", program.opts());




export default program;