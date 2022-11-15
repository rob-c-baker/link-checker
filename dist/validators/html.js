import { HtmlValidate } from "html-validate";
import { Validator } from "./validator.js";
export class Html extends Validator {
    canValidate() {
        // @todo
        return this.content_type === 'text/html';
    }
    isValid() {
        const report = Html.html_validate.validateString(this.body);
        const errors = [];
        for (const result of report.results) {
            for (const message of result.messages) {
                errors.push({
                    message: message.message,
                    data: {
                        severity: message.severity,
                        line: message.line,
                        column: message.column
                    }
                });
            }
        }
        this.errors = errors;
        return report.valid;
    }
}
Html.html_validate = new HtmlValidate();
//# sourceMappingURL=html.js.map