import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import App from "./App";

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([])
        })
    );
});

afterEach(() => {
    jest.clearAllMocks();
});

test("renders employee resource directory", async () => {
    render(<App />);

    expect(
        await screen.findByText("Employee Resource Directory")
    ).toBeInTheDocument();
});