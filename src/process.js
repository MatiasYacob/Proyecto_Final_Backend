import { Command } from "commander";
import { Devlogger } from "./config/logger_CUSTOM";
const program = new Command();

program
    .option('-d','Variable para debug', false)
    .option('-p <port>','Puerto del Servidor', 8080)
    .option('--mode <mode>', 'Mode de trabajo', 'develop')

    .option('-u <user>', 'Usuario que va a utilizar el aplicativo')



program.parse();

Devlogger.info("Options:", program.opts());




export default program;