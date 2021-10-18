import React from "react";
import { render, screen } from "../test-utils";
import HomePage from "../../pages/index";

describe("HomePage", () => {
    it("should render the heading", () => {
        const textToFind = "Start earning donations via crypto"

        const { debug } = render(<HomePage />);
        debug()
        // const heading = screen.getByText(textToFind);

        // expect(heading).toBeInTheDocument();
    });
});
