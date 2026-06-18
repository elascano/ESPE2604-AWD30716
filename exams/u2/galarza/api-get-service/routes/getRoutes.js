const express = require("express");
const router = express.Router();

const fetchData = async () => {
    const response = await fetch(`http://${process.env.DB_HOST || 'localhost'}:${process.env.PORT_DB}/db/${process.env.ITEM_PLURAL}`);
    return await response.json();
};

const calculateTimeElapsed = (dateString) => {
    if (!dateString) return { years: 0, months: 0, days: 0 };
    const [day, month, year] = dateString.split("/");
    const itemDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    
    let years = currentDate.getFullYear() - itemDate.getFullYear();
    let months = currentDate.getMonth() - itemDate.getMonth();
    let days = currentDate.getDate() - itemDate.getDate();

    if (days < 0) {
        months -= 1;
        const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += previousMonth.getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }
    return { years, months, days };
};

const parseAndSortData = (data) => {
    const processedData = data.map(item => {
        const [day, month, year] = item.date.split("/");
        return { ...item, parsedDate: new Date(year, month - 1, day) };
    });
    return processedData.sort((a, b) => b.parsedDate - a.parsedDate);
};

router.get(`/${process.env.APP_NAME}/${process.env.ITEM_PLURAL}`, async (req, res) => {
    try {
        const data = await fetchData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get(`/${process.env.APP_NAME}/${process.env.ITEM_PLURAL}/categories`, async (req, res) => {
    try {
        const data = await fetchData();
        const sortedData = parseAndSortData(data);
        
        const result = sortedData.reduce((acc, item) => {
            delete item.parsedDate;
            if (item.isNew) {
                acc.news.push(item);
            } else {
                acc.olders.push(item);
            }
            return acc;
        }, { news: [], olders: [] });
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get(`/${process.env.APP_NAME}/${process.env.ITEM_PLURAL}/categories`, async (req, res) => {
    try {
        const data = await fetchData();
        const sortedData = parseAndSortData(data);
        
        const result = sortedData.reduce((acc, item) => {
            delete item.parsedDate;
            if (item.isNew) acc.active.push(item);
            else acc.inactive.push(item);
            return acc;
        }, { news: [], olders: [] });
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get(`/${process.env.APP_NAME}/${process.env.ITEM_PLURAL}/category/:status`, async (req, res) => {
    try {
        const { status } = req.params;
        if (status !== 'new' && status !== 'older') {
            return res.status(400).json({ error: "Invalid status. Use 'new' or 'older'." });
        }
        
        const data = await fetchData();
        const sortedData = parseAndSortData(data);
        const isTargetNew = status === 'new';
        
        const filteredData = sortedData.filter(item => item.isNew === isTargetNew).map(item => {
            delete item.parsedDate;
            return item;
        });
        
        res.json(filteredData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
