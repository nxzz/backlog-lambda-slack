'use strict';
const BACKLOGURL = process.env.BACKLOGURL;

module.exports = event => {
    const msg = {};
    switch (event.type) {
        case 1:
            // 新規課題
            msg.title = `新規課題: ${event.content.summary}`;
            msg.value = `
                種別: ${event.content.issueType.name}
                作成者: ${event.createdUser.name}
                担当者: ${event.content.assignee ? event.content.assignee.name : "未設定"}
                ${event.content.description}
                ${BACKLOGURL}/view/${event.project.projectKey}-${event.content.key_id}`;
            break;
        case 2:
            // 課題更新
            msg.title = `課題更新:${event.content.summary}`;
            msg.value = `
                更新者: ${event.createdUser.name}
                ${event.content.summary}
                ${BACKLOGURL}/view/${event.project.projectKey}-${event.content.key_id}`;
            break;
        case 3:
            // 課題コメント
            msg.title = `コメント:${event.content.summary}`;
            msg.value = `
                投稿者: ${event.createdUser.name}
                ${event.content.comment.content}
                ${BACKLOGURL}/view/${event.project.projectKey}-${event.content.key_id}#comment-${event.content.comment.id}`;
            break;
        case 8:
            // ファイル作成
            msg.title = `ファイル作成:${event.content.dir}${event.content.name}`;
            msg.value = `
                ユーザ: ${event.createdUser.name}
                ${BACKLOGURL}/file/${event.project.projectKey}${event.content.dir}${event.content.name}`;
            break;
        case 9:
            // ファイル更新
            msg.title = `ファイル更新:${event.content.dir}${event.content.name}`;
            msg.value = `
                ユーザ: ${event.createdUser.name}
                ${BACKLOGURL}/file/${event.project.projectKey}${event.content.dir}${event.content.name}`;
            break;
        case 10:
            // ファイル削除
            msg.title = `ファイル削除:${event.content.dir}${event.content.name}`;
            msg.value = `
                ユーザ: ${event.createdUser.name}`;
            break;
        default:
            // 未定義
            msg.title = `未定義イベント`;
            msg.value = JSON.stringify(event);
    }
    msg.value = msg.value.replace(/                /g, '');
    return msg;
};