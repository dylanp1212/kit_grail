"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
dotenv_1.default.config({ path: '../../.env', override: false });
const app_1 = __importDefault(require("./app"));
app_1.default.listen(3013, () => {
    console.log(`Server Running on port 3013`);
    console.log('API Testing UI: http://localhost:3013/api/v0/docs/');
});
