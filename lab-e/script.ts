type AppState = {
    currentStyle: string;
    styles: { [key: string]: string };
};

const appState: AppState = {
    currentStyle: 'Style 1',
    styles: {
        'Style 1': 'styles/page1.css',
        'Style 2': 'styles/page2.css',
        'Style 3': 'styles/page3.css',
    },
};

const styleLinkId = 'pageStyle';

// Zmiana stylu
function changeStyle(newStyle: string) {
    const styleLink = document.getElementById(styleLinkId);

    if (styleLink) {
        styleLink.remove();
    }

    const newLink = document.createElement('link');
    newLink.id = styleLinkId;
    newLink.rel = 'stylesheet';
    newLink.href = appState.styles[newStyle];

    document.head.appendChild(newLink);
    appState.currentStyle = newStyle;
}

// Dynamiczne tworzenie przycisków do stylów
function createStyleButtons() {
    const container = document.querySelector('.style_links') as HTMLElement;
    container.innerHTML = '';

    for (const styleName in appState.styles) {
        const button = document.createElement('button');
        button.textContent = styleName;

        button.addEventListener('click', () => {
            changeStyle(styleName);
        });

        container.appendChild(button);
    }
}

createStyleButtons();
