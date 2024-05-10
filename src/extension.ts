'use strict';
import * as vscode from 'vscode';
import { TextLine, Selection, TextEditor, Range, Position } from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('code-jump.jumpDown', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        editor.selections = editor.selections
            .map(sel => jumpDown(sel, editor))
            .filter(sel => !!sel);

        scrollFirstSelectionIntoView(editor);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('code-jump.jumpUp', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        editor.selections = editor.selections
            .map(sel => jumpUp(sel, editor))
            .filter(sel => !!sel);

        scrollFirstSelectionIntoView(editor);
    }));
}

function jumpUp(selection: Selection, editor: TextEditor): Selection | undefined {
    const cursorPos = selection.active,
        char = cursorPos.character;
        
    for (let i = cursorPos.line - 1; i >= 0; i--) {
        if (!editor.document.lineAt(i).isEmptyOrWhitespace) {
            return makeSelection(i, char);
        }
    }

    return selection;
}

function jumpDown(selection: Selection, editor: TextEditor): Selection | undefined {
    const cursorPos = selection.active,
        lineCount = editor.document.lineCount,
        char = cursorPos.character;

    for (let i = cursorPos.line + 1; i < lineCount; i++) {
        if (!editor.document.lineAt(i).isEmptyOrWhitespace) {
            return makeSelection(i, char);
        }
    }

    return selection;
}

function makeSelection(line: number, char: number): Selection {
    const newPos = new Position(line, char);
    return new Selection(newPos, newPos);
}

function scrollFirstSelectionIntoView(editor: TextEditor) {
    if (editor.selections.length < 1) {
        return;
    }

    const pos = editor.selections[0].active;
    editor.revealRange(new Range(pos, pos));
}

export function deactivate() {
}
