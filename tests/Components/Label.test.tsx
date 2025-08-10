import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import type { Language } from "../../src/providers/language/type";

describe("Label", () => {
  const renderComponent = (language: Language, labelId: string) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  describe("Given current language is English", () => {
    it.each([
      { labelId: "welcome", text: "Welcome" },
      { labelId: "new_product", text: "New Product" },
      { labelId: "edit_product", text: "Edit Product" },
    ])(
      "should render text $text for the label ID $labelId",
      ({ labelId, text }) => {
        renderComponent("en", labelId);
        expect(screen.getByText(text)).toBeInTheDocument();
      }
    );
    it("should throw an error for an invalid label ID", () => {
      expect(() => renderComponent("en", "!")).toThrowError();
    });
  });

  describe("Given current language is spanish", () => {
    it.each([
      { labelId: "welcome", text: "Bienvenidos" },
      { labelId: "new_product", text: "Nuevo Producto" },
      { labelId: "edit_product", text: "Editar Producto" },
    ])(
      "should render text $text for the label ID $labelId",
      ({ labelId, text }) => {
        renderComponent("es", labelId);
        expect(screen.getByText(text)).toBeInTheDocument();
      }
    );
  });
});
