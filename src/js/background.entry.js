import { OTHER, RIGHT, LEFT } from './constants/menuId';
import { takeWhile } from './util/iter';

for (const [id, title] of [
	[OTHER, 'Discard other tabs'],
	[RIGHT, 'Discard tabs to the right'],
	[LEFT, 'Discard tabs to the left'],
]) {
	chrome.contextMenus.create({ id, title, contexts: ['action'] });
}

chrome.contextMenus.onClicked.addListener(async ({ menuItemId }, { id: activeTabId, windowId }) => {
	const tabsInCurrentWindow = await chrome.tabs.query({ windowId });

	let tabIds = tabsInCurrentWindow
		.filter(({ audible }) => !audible)
		.map(({ id }) => id);

	switch (menuItemId) {
		case OTHER:
			tabIds = tabIds.filter(id => id !== activeTabId);
			break;
		case RIGHT:
			tabIds = tabIds.reverse();
			/* fall through */
		case LEFT:
			tabIds = takeWhile(tabIds, id => id !== activeTabId);
			break;
	}

	for (const id of tabIds) {
		chrome.tabs.discard(id);
	}
});

chrome.action.onClicked.addListener(async ({ windowId }) => {
	const highlightedInCurrentWindow = await chrome.tabs.query({ windowId, highlighted: true });

	const tabIds = highlightedInCurrentWindow.map(({ id }) => id);

	for (const id of tabIds) {
		chrome.tabs.discard(id);
	}
});
