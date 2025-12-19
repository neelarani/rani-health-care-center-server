"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askOpenRouter = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const askOpenRouter = async (messages) => {
    const response = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'openai/gpt-3.5-turbo', // or 'anthropic/claude-3-haiku'
        messages,
    }, {
        headers: {
            'Authorization': `Bearer ${config_1.default.openRouterApiKey}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data.choices[0].message.content;
};
exports.askOpenRouter = askOpenRouter;
