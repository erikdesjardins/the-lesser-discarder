import { OTHER, RIGHT, LEFT } from './constants/menuId';
import { takeWhile } from './util/iter';
import { apiToPromise } from './util/promise';

for (const [id, title] of [
	[OTHER, 'Discard other tabs'],
	[LEFT, 'Discard tabs to the left'],
	[RIGHT, 'Discard tabs to the right'],
]) {
	chrome.contextMenus.create({ id, title, contexts: ['browser_action'] });
}

chrome.contextMenus.onClicked.addListener(async ({ menuItemId }, { id: activeTabId, windowId }) => {
	const query = apiToPromise(chrome.tabs.query);
	const discard = apiToPromise(chrome.tabs.discard);

	const tabsInCurrentWindow = await query({ windowId });
	let tabIds = tabsInCurrentWindow.map(({ id }) => id);
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
		discard(id);
	}
});
