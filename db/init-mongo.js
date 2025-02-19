db = db.getSiblingDB('stockiyt');
const collections = ['features', 'stats', 'score', 'rating']
collections.forEach(collection=>{
    db.createCollection(collection, {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['_ts','ticker'],
                properties: {
                    ticker:{
                        bsonType:"string",
                        description:"Ticker of target stock"
                    },
                    _ts: {
                        bsonType: "date",
                        description: "Must be a timestamp, defaults to now",
                        default: { $currentDate: { $type: "date" } }
                    }
                }
            }
        }
    });
    db[collection].createIndex({ticker: 1, _ts: -1});
    db[collection].createIndex({_ts: -1});
    db[collection].createIndex({ticker: 1});
})

db.createCollection('raw', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['_ts','ticker', 'processed'],
            properties: {
                ticker:{
                    bsonType:"string",
                    description:"Ticker of target stock"
                },
                _ts: {
                    bsonType: "date",
                    description: "Must be a timestamp, defaults to now",
                    default: { $currentDate: { $type: "date" } }
                },
                processed:{
                    bsonType: "boolean",
                    description: "Indicates if value has been processed.",
                    default: false
                }
            }
        }
    }
});
db.createIndex({ticker: 1, processed, _ts: -1});
db.createIndex({_ts: -1});
db.createIndex({ticker: 1});

db.stats.createIndex({ticker:1, period:1, _ts: -1})
db.createCollection('mapping');
db.mapping.createIndex({source:1, destination:1})
db.mapping.insertOne({
    "source": "yahoo_finance",
    "destination": "stats",
    "period": "daily",
    "has": "yahoo_finance.symbol",
    "def": {
        "ticker": "yahoo_finance.symbol",
        "shortName": "yahoo_finance.shortName",
        "sector": "yahoo_finance.sector",
        "industry": "yahoo_finance.industry",
        "marketCap": "yahoo_finance.marketCap",
        "currentPrice": "yahoo_finance.currentPrice",
        "previousClose": "yahoo_finance.previousClose",
        "open": "yahoo_finance.open",
        "dayHigh": "yahoo_finance.dayHigh",
        "dayLow": "yahoo_finance.dayLow",
        "fiftyTwoWeekHigh": "yahoo_finance.fiftyTwoWeekHigh",
        "fiftyTwoWeekLow": "yahoo_finance.fiftyTwoWeekLow",
        "volume": "yahoo_finance.volume",
        "averageVolume": "yahoo_finance.averageVolume",
        "beta": "yahoo_finance.beta",
        "trailingPE": "yahoo_finance.trailingPE",
        "forwardPE": "yahoo_finance.forwardPE",
        "dividendYield": "yahoo_finance.dividendYield",
        "payoutRatio": "yahoo_finance.payoutRatio",
        "totalCash": "yahoo_finance.totalCash",
        "totalDebt": "yahoo_finance.totalDebt",
        "totalRevenue": "yahoo_finance.totalRevenue",
        "revenuePerShare": "yahoo_finance.revenuePerShare",
        "grossProfits": "yahoo_finance.grossProfits",
        "ebitda": "yahoo_finance.ebitda",
        "profitMargins": "yahoo_finance.profitMargins",
        "operatingMargins": "yahoo_finance.operatingMargins",
        "returnOnEquity": "yahoo_finance.returnOnEquity",
        "returnOnAssets": "yahoo_finance.returnOnAssets",
        "debtToEquity": "yahoo_finance.debtToEquity",
        "pegRatio": "yahoo_finance.pegRatio",
        "recommendationKey": "yahoo_finance.recommendationKey",
        "targetMeanPrice": "yahoo_finance.targetMeanPrice",
        "targetHighPrice": "yahoo_finance.targetHighPrice",
        "targetLowPrice": "yahoo_finance.targetLowPrice",
        "earningsGrowth": "yahoo_finance.earningsGrowth",
        "revenueGrowth": "yahoo_finance.revenueGrowth",
        "trailingAnnualDividendRate": "yahoo_finance.trailingAnnualDividendRate",
        "forwardAnnualDividendRate": "yahoo_finance.forwardAnnualDividendRate",
        "floatShares": "yahoo_finance.floatShares",
        "sharesOutstanding": "yahoo_finance.sharesOutstanding",
        "sharesShort": "yahoo_finance.sharesShort",
        "shortRatio": "yahoo_finance.shortRatio"
    }
});

db.mapping.insertOne({
    "source": "alpha_vantage",
    "destination": "stats",
    "period": "daily",
    "has": "alpha_vantage.symbol",
    "def": {
        "ticker": "alpha_vantage.symbol",
        "marketCap": "alpha_vantage.marketCap",
        "currentPrice": "alpha_vantage.price",
        "previousClose": "alpha_vantage.previousClose",
        "open": "alpha_vantage.open",
        "dayHigh": "alpha_vantage.high",
        "dayLow": "alpha_vantage.low",
        "volume": "alpha_vantage.volume",
        "averageVolume": "alpha_vantage.avgVolume",
        "trailingPE": "alpha_vantage.peRatio",
        "forwardPE": "alpha_vantage.forwardPE",
        "dividendYield": "alpha_vantage.dividendYield",
        "payoutRatio": "alpha_vantage.payoutRatio",
        "totalRevenue": "alpha_vantage.totalRevenue",
        "profitMargins": "alpha_vantage.profitMargin",
        "operatingMargins": "alpha_vantage.operatingMargin",
        "debtToEquity": "alpha_vantage.debtToEquity",
        "recommendationKey": "alpha_vantage.recommendation",
        "targetMeanPrice": "alpha_vantage.targetMeanPrice"
    }
});

db.mapping.insertOne({
    "source": "iex",
    "destination": "stats",
    "period": "weekly",
    "has": "iex_cloud.symbol",
    "def": {
        "period": "weekly",
        "ticker": "iex_cloud.symbol",
        "sector": "iex_cloud.sector",
        "industry": "iex_cloud.industry",
        "marketCap": "iex_cloud.marketCap",
        "fiftyTwoWeekHigh": "iex_cloud.week52High",
        "fiftyTwoWeekLow": "iex_cloud.week52Low",
        "beta": "iex_cloud.beta",
        "dividendYield": "iex_cloud.dividendYield",
        "payoutRatio": "iex_cloud.payoutRatio",
        "totalCash": "iex_cloud.totalCash",
        "totalDebt": "iex_cloud.totalDebt",
        "totalRevenue": "iex_cloud.totalRevenue",
        "grossProfits": "iex_cloud.grossProfit",
        "ebitda": "iex_cloud.ebitda",
        "profitMargins": "iex_cloud.profitMargin",
        "returnOnEquity": "iex_cloud.returnOnEquity",
        "returnOnAssets": "iex_cloud.returnOnAssets",
        "debtToEquity": "iex_cloud.debtToEquity",
        "pegRatio": "iex_cloud.pegRatio",
        "recommendationKey": "iex_cloud.recommendation",
        "shortRatio": "iex_cloud.shortRatio",
        "shortPercentOfFloat": "iex_cloud.shortPercentOfFloat"
    }
});

db.mapping.insertOne({
    "source": "raw",
    "period": "weekly",
    "destination":"stats",
    "has": "yahoo_finance.symbol",
    "def": {
        "period": "weekly",
        "ticker": "yahoo_finance.symbol",
        "shortName": "yahoo_finance.shortName",
        "marketCap": "yahoo_finance.marketCap",
        "fiftyTwoWeekHigh": "yahoo_finance.fiftyTwoWeekHigh",
        "fiftyTwoWeekLow": "yahoo_finance.fiftyTwoWeekLow",
        "beta": "yahoo_finance.beta",
        "trailingPE": "yahoo_finance.trailingPE",
        "forwardPE": "yahoo_finance.forwardPE",
        "dividendYield": "yahoo_finance.dividendYield",
        "payoutRatio": "yahoo_finance.payoutRatio",
        "totalCash": "yahoo_finance.totalCash",
        "totalDebt": "yahoo_finance.totalDebt",
        "totalRevenue": "yahoo_finance.totalRevenue",
        "revenuePerShare": "yahoo_finance.revenuePerShare",
        "grossProfits": "yahoo_finance.grossProfits",
        "ebitda": "yahoo_finance.ebitda",
        "profitMargins": "yahoo_finance.profitMargins",
        "operatingMargins": "yahoo_finance.operatingMargins",
        "returnOnEquity": "yahoo_finance.returnOnEquity",
        "returnOnAssets": "yahoo_finance.returnOnAssets",
        "debtToEquity": "yahoo_finance.debtToEquity",
        "pegRatio": "yahoo_finance.pegRatio",
        "recommendationKey": "yahoo_finance.recommendationKey",
        "targetMeanPrice": "yahoo_finance.targetMeanPrice",
        "targetHighPrice": "yahoo_finance.targetHighPrice",
        "targetLowPrice": "yahoo_finance.targetLowPrice",
        "earningsGrowth": "yahoo_finance.earningsGrowth",
        "revenueGrowth": "yahoo_finance.revenueGrowth",
        "trailingAnnualDividendRate": "yahoo_finance.trailingAnnualDividendRate",
        "forwardAnnualDividendRate": "yahoo_finance.forwardAnnualDividendRate",
        "bookValue": "yahoo_finance.bookValue",
        "priceToBook": "yahoo_finance.priceToBook",
        "enterpriseValue": "yahoo_finance.enterpriseValue",
        "heldPercentInstitutions": "yahoo_finance.heldPercentInstitutions",
        "heldPercentInsiders": "yahoo_finance.heldPercentInsiders",
        "sharesShort": "yahoo_finance.sharesShort",
        "shortRatio": "yahoo_finance.shortRatio",
        "shortPercentOfFloat": "yahoo_finance.shortPercentOfFloat",
        "mostRecentQuarter": "yahoo_finance.mostRecentQuarter",
        "earningsQuarterlyGrowth": "yahoo_finance.earningsQuarterlyGrowth",
        "quickRatio": "yahoo_finance.quickRatio",
        "currentRatio": "yahoo_finance.currentRatio",
        "fullTimeEmployees": "yahoo_finance.fullTimeEmployees"
    }    
});

db.mapping.insertOne({
    "source": "raw",
    "period": "monthly",
    "destination":"stats",
    "has": "yahoo_finance.symbol",
    "def": {
        "ticker": "yahoo_finance.symbol",
        "shortName": "yahoo_finance.shortName",
        "fiftyTwoWeekHigh": "yahoo_finance.fiftyTwoWeekHigh",
        "fiftyTwoWeekLow": "yahoo_finance.fiftyTwoWeekLow",
        "beta": "yahoo_finance.beta",
        "trailingPE": "yahoo_finance.trailingPE",
        "forwardPE": "yahoo_finance.forwardPE",
        "dividendYield": "yahoo_finance.dividendYield",
        "payoutRatio": "yahoo_finance.payoutRatio",
        "totalCash": "yahoo_finance.totalCash",
        "totalDebt": "yahoo_finance.totalDebt",
        "totalRevenue": "yahoo_finance.totalRevenue",
        "revenuePerShare": "yahoo_finance.revenuePerShare",
        "grossProfits": "yahoo_finance.grossProfits",
        "ebitda": "yahoo_finance.ebitda",
        "profitMargins": "yahoo_finance.profitMargins",
        "operatingMargins": "yahoo_finance.operatingMargins",
        "returnOnEquity": "yahoo_finance.returnOnEquity",
        "returnOnAssets": "yahoo_finance.returnOnAssets",
        "debtToEquity": "yahoo_finance.debtToEquity",
        "pegRatio": "yahoo_finance.pegRatio",
        "recommendationKey": "yahoo_finance.recommendationKey",
        "targetMeanPrice": "yahoo_finance.targetMeanPrice",
        "targetHighPrice": "yahoo_finance.targetHighPrice",
        "targetLowPrice": "yahoo_finance.targetLowPrice",
        "earningsGrowth": "yahoo_finance.earningsGrowth",
        "revenueGrowth": "yahoo_finance.revenueGrowth",
        "trailingAnnualDividendRate": "yahoo_finance.trailingAnnualDividendRate",
        "forwardAnnualDividendRate": "yahoo_finance.forwardAnnualDividendRate",
        "bookValue": "yahoo_finance.bookValue",
        "priceToBook": "yahoo_finance.priceToBook",
        "enterpriseValue": "yahoo_finance.enterpriseValue",
        "heldPercentInstitutions": "yahoo_finance.heldPercentInstitutions",
        "heldPercentInsiders": "yahoo_finance.heldPercentInsiders",
        "sharesShort": "yahoo_finance.sharesShort",
        "shortRatio": "yahoo_finance.shortRatio",
        "shortPercentOfFloat": "yahoo_finance.shortPercentOfFloat",
        "mostRecentQuarter": "yahoo_finance.mostRecentQuarter",
        "earningsQuarterlyGrowth": "yahoo_finance.earningsQuarterlyGrowth",
        "quickRatio": "yahoo_finance.quickRatio",
        "currentRatio": "yahoo_finance.currentRatio",
        "fullTimeEmployees": "yahoo_finance.fullTimeEmployees"
    }    
});


db.mapping.insertOne({
    "source": "raw",
    "destination": "stats",
    "period": "monthly",
    "has": "fmp.symbol",
    "def": {
        "ticker": "fmp.symbol",
        "shortName": "fmp.name",
        "sector": "fmp.sector",
        "industry": "fmp.industry",
        "marketCap": "fmp.marketCap",
        "fiftyTwoWeekHigh": "fmp.week52High",
        "fiftyTwoWeekLow": "fmp.week52Low",
        "beta": "fmp.beta",
        "trailingPE": "fmp.peRatio",
        "forwardPE": "fmp.forwardPE",
        "dividendYield": "fmp.dividendYield",
        "payoutRatio": "fmp.payoutRatio",
        "totalCash": "fmp.totalCash",
        "totalDebt": "fmp.totalDebt",
        "totalRevenue": "fmp.totalRevenue",
        "revenuePerShare": "fmp.revenuePerShare",
        "grossProfits": "fmp.grossProfit",
        "ebitda": "fmp.ebitda",
        "profitMargins": "fmp.profitMargin",
        "operatingMargins": "fmp.operatingMargin",
        "returnOnEquity": "fmp.returnOnEquity",
        "returnOnAssets": "fmp.returnOnAssets",
        "debtToEquity": "fmp.debtToEquity",
        "pegRatio": "fmp.pegRatio",
        "targetMeanPrice": "fmp.targetMeanPrice",
        "targetHighPrice": "fmp.targetHighPrice",
        "targetLowPrice": "fmp.targetLowPrice",
        "shortRatio": "fmp.shortRatio",
        "shortPercentOfFloat": "fmp.shortPercentOfFloat",
        "earningsQuarterlyGrowth": "fmp.earningsGrowth",
        "quickRatio": "fmp.quickRatio",
        "currentRatio": "fmp.currentRatio"
    }
});
