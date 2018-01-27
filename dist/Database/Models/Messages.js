"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Sequelize_1 = require("sequelize-typescript/lib/models/Sequelize");
let Messages = class Messages extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Default(Sequelize_1.Sequelize.UUIDV4),
    sequelize_typescript_1.Column(Sequelize_1.Sequelize.UUID),
    __metadata("design:type", Number)
], Messages.prototype, "uuid", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Messages.prototype, "guildID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Messages.prototype, "userId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Messages.prototype, "message", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Object)
], Messages.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Object)
], Messages.prototype, "updatedAt", void 0);
Messages = __decorate([
    sequelize_typescript_1.Table
], Messages);
exports.Messages = Messages;
