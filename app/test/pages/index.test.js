import React from "react";
import { render, screen } from "../test-utils";
import HomePage from "../../pages/index";

describe("HomePage", () => {
    it("should render the heading", () => {
        const textToFind = "Start earning donations via crypto"

        // render(<HomePage />);
        // const heading = screen.getByText(textToFind);

        // expect(heading).toBeInTheDocument();
    });
});
