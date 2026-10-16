import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { queries, sourceResult } from "./source";
import { compareExport } from "./compare";

for (const query of queries()) {
  const { kind, id } = query;

  test(`${kind} ${id}: downloaded TSV matches source`, async ({ page }, info) => {
    const response = page.waitForResponse(
      `**/${kind}/${encodeURIComponent(id)}.json`,
    );
    await page.goto(`/${kind}?id=${encodeURIComponent(id)}`);
    expect((await response).ok(), "Query data request must succeed").toBe(true);

    for (const unit of ["continuous", "thresholded"]) {
      await page
        .getByRole("button", { name: new RegExp(`^${unit}$`, "i") })
        .click();

      for (const filtered of [false, true]) {
        const exportButton = page.getByRole("button", {
          name: "Export TSV", exact: true,
        });
        await exportButton.waitFor();
        if ((await page.getByRole("checkbox").isChecked()) !== filtered) {
          // The checkbox is visually hidden; click its visible label.
          await page
            .getByText("Low Heterogeneity (I² < 20%)", { exact: true })
            .click();
          await exportButton.waitFor();
        }

        const name = `${unit}-${filtered ? "filtered" : "unfiltered"}`;
        const expected = sourceResult(query, unit, filtered);
        await info.attach(`${name} source`, {
          body: expected,
          contentType: "text/tab-separated-values",
        });
        const pendingDownload = page.waitForEvent("download");
        await exportButton.click();
        const path = info.outputPath(`${name}.tsv`);
        await (await pendingDownload).saveAs(path);
        await info.attach(name, { path, contentType: "text/tab-separated-values" });

        compareExport(await readFile(path, "utf8"), expected);
      }
    }
  });
}
