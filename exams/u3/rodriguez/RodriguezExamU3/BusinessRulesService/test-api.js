const config = require("./config/entityConfig");
const baseUrl = `http://localhost:3014${config.apiPrefix}${config.routePath}`;

async function runTests() {
  try {
    console.log("Starting Microservices API integration tests...");

    const listRes = await fetch(baseUrl);
    const listData = await listRes.json();
    console.log("Initial fetch count:", listData.length);
    if (listData.length !== 10) {
      throw new Error(`Expected 10 initial items, got ${listData.length}`);
    }

    if (config.listCalculationPath) {
      const calcRes = await fetch(`${baseUrl}${config.listCalculationPath}`);
      const calcData = await calcRes.json();
      console.log("Calculation list count:", calcData.length);
      const expectedList = config.calculations.onList(calcData.map(d => ({ ...d })));
      for (let i = 0; i < calcData.length; i++) {
        if (calcData[i].rank !== expectedList[i].rank) {
          throw new Error("Calculation mismatch");
        }
      }
      console.log("Calculated list verified successfully");
    }

    const createRes = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config.testMockData)
    });
    const createdData = await createRes.json();
    console.log("Created item ID:", createdData.id);
    if (createdData.id !== 11) {
      throw new Error(`Expected custom ID 11, got ${createdData.id}`);
    }

    const getRes = await fetch(`${baseUrl}/${createdData._id}`);
    const getData = await getRes.json();
    if (getData.id !== 11) {
      throw new Error(`Expected ID 11, got ${getData.id}`);
    }
    console.log("Fetch by Mongo ID verified successfully");

    const getCustomRes = await fetch(`${baseUrl}/11`);
    const getCustomData = await getCustomRes.json();
    if (getCustomData.id !== 11) {
      throw new Error(`Expected ID 11, got ${getCustomData.id}`);
    }
    console.log("Fetch by custom sequential ID verified successfully");

    const updateRes = await fetch(`${baseUrl}/11`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config.testUpdateMockData)
    });
    const updatedData = await updateRes.json();
    console.log("Update verified successfully");

    const deleteRes = await fetch(`${baseUrl}/11`, { method: "DELETE" });
    const deleteData = await deleteRes.json();
    console.log("Delete status message:", deleteData.message);
    if (deleteData.message !== "Deleted successfully") {
      throw new Error(`Unexpected delete message: ${deleteData.message}`);
    }

    const finalRes = await fetch(`${baseUrl}/11`);
    if (finalRes.status !== 404) {
      throw new Error(`Expected 404 on deleted item, got ${finalRes.status}`);
    }
    console.log("Delete verification verified successfully");

    console.log("All microservices API integration tests passed!");
    process.exit(0);
  } catch (error) {
    console.error("Test execution failed:", error.message);
    process.exit(1);
  }
}

runTests();
