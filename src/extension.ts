'use strict';
import * as vscode from 'vscode';
import { Range, Position } from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('column-jump.jumpDown', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        const cursorPos = editor.selection.active;
        const lineCount = editor.document.lineCount;
        for (let i = cursorPos.line + 1; i < lineCount; i++) {
            if (jump(editor, cursorPos, i)) {
                return;
            }
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('column-jump.jumpUp', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        const cursorPos = editor.selection.active;

        for (let i = cursorPos.line - 1; i >= 0; i--) {
            if (jump(editor, cursorPos, i)) {
                return;
            }
        }
    }));
}

function jump(editor: vscode.TextEditor, cursorPos: Position, i: number): boolean {
    const line = editor.document.lineAt(i);
    if (!line.isEmptyOrWhitespace && line.range.end.character >= cursorPos.character && line.firstNonWhitespaceCharacterIndex <= cursorPos.character) {
        const newPos = new Position(i, cursorPos.character);
        editor.revealRange(new Range(newPos, newPos));
        var newSelection = new vscode.Selection(newPos, newPos);
        editor.selection = newSelection;
        return true;
    }
    return false;
}

export function deactivate() {
}