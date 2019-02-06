'use strict';
/*
The MIT License (MIT)

Copyright 2019 Rimpei Kunimoto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

const BACKLOGURL = process.env.BACKLOGURL;

const BACKLOGSTATUS = ["未設定", "未対応", "処理中", "処理済み", "完了"];
const BACKLOGPRIORITY = ["未設定", "未設定", "高", "中", "低"];

module.exports = event => {
    const msg = {};
    switch (event.type) {
        case 1:
            // 新規課題
            {
                msg.title = `新規課題: ${event.content.summary}`;
                msg.value = `
                    種別: ${event.content.issueType.name}
                    作成者: ${event.createdUser.name}
                    担当者: ${event.content.assignee ? event.content.assignee.name : "未設定"}
                    優先度: ${event.content.priority.name}
                    期限日: ${event.content.dueDate ? event.content.dueDate : "未設定"}
                    ${event.content.description}
                    ${BACKLOGURL}/view/${event.project.projectKey}-${event.content.key_id}`;
            }
            break;
        case 2:
        case 3:
            // 課題更新
            // 課題コメント
            {
                msg.title = `課題更新:${event.content.summary}`;
                let changes = "";
                if (event.content.changes) {
                    for (const change of event.content.changes) {
                        switch (change.field) {
                            case "status":
                                changes += `状態が ${BACKLOGSTATUS[change.old_value]} から ${BACKLOGSTATUS[change.new_value]} に変更されました\n`;
                                break;
                            case "limitDate":
                                changes += `期限日が ${change.old_value ? change.old_value : "未設定"} から ${change.new_value ? change.new_value : "未設定"} に変更されました\n`;
                                break;
                            case "priority":
                                changes += `優先度が ${BACKLOGPRIORITY[change.old_value]} から ${BACKLOGPRIORITY[change.new_value]} に変更されました\n`;
                                break;
                            default:
                                // 未定義
                                changes += `未定義の変更点`;
                                changes += JSON.stringify(change);
                                changes += "\n";
                                break;
                        }
                    }
                }
                msg.value = `
                    更新者: ${event.createdUser.name}
                    ${changes}
                    ${event.content.comment.content ? "コメント: \n" + event.content.comment.content : ""}
                    ${BACKLOGURL}/view/${event.project.projectKey}-${event.content.key_id}`;
            }
            break;
            // 削除された課題名は取れない
        case 4:
            // 課題削除
            msg.title = `課題削除`;
            msg.value = `
                更新者: ${event.createdUser.name}`;
            break;
        case 14:
            // 課題一括更新
            {
                msg.title = `課題一括更新`;
                let issues = "";
                for (const issue of event.content.link) {
                    issues += `${issue.title} ${BACKLOGURL}/view/${event.project.projectKey}-${issue.key_id}\n`;
                }
                let changes = "";
                for (const change of event.content.changes) {
                    switch (change.field) {
                        case "status":
                            changes += `状態が ${BACKLOGSTATUS[change.new_value]} に変更されました\n`;
                            break;
                        case "limitDate":
                            changes += `期限日が ${change.new_value ? change.new_value : "未設定"} に変更されました\n`;
                            break;
                        case "priority":
                            changes += `優先度が ${change.new_value} に変更されました\n`;
                            break;
                        default:
                            // 未定義
                            changes += `未定義の変更点`;
                            changes += JSON.stringify(change);
                            changes += "\n";
                            break;
                    }
                }
                msg.value = `
                    更新者: ${event.createdUser.name}
                    ${issues}
                    上記の課題について、以下の内容の一括更新が行われました
                    ${changes}`;
            }
            break;
        case 8:
            // ファイル作成
            {
                msg.title = `ファイル作成:${event.content.dir}${event.content.name}`;
                msg.value = `
                    更新者: ${event.createdUser.name}
                    ${BACKLOGURL}/file/${event.project.projectKey}${event.content.dir}${event.content.name}`;
            }
            break;
        case 9:
            // ファイル更新
            {
                msg.title = `ファイル更新:${event.content.dir}${event.content.name}`;
                msg.value = `
                    更新者: ${event.createdUser.name}
                    ${BACKLOGURL}/file/${event.project.projectKey}${event.content.dir}${event.content.name}`;
            }
            break;
        case 10:
            // ファイル削除
            {
                msg.title = `ファイル削除:${event.content.dir}${event.content.name}`;
                msg.value = `
                    更新者: ${event.createdUser.name}`;
            }
            break;
        default:
            // 未定義
            {
                msg.title = `未定義イベント`;
                msg.value = JSON.stringify(event);
            }
            break;
    }
    msg.value = msg.value.replace(/ {20}/g, '');
    return msg;
};