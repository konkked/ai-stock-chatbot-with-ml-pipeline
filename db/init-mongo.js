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
db.raw.createIndex({ticker: 1, processed, _ts: -1});
db.raw.createIndex({_ts: -1});
db.raw.createIndex({ticker: 1});

db.stats.createIndex({ticker:1, period:1, _ts: -1})
db.createCollection('mapping');
db.mapping.createIndex({source:1, destination:1})
db.mapping.insertOne({
    "source": "raw",
    "destination": "daily_stats",
    "has": "$.raw.yahoo_finance.symbol",
    "def": {
        "ticker": "$.raw.yahoo_finance.symbol",
        "shortName": "$.raw.yahoo_finance.shortName",
        "longName": "$.raw.yahoo_finance.longName|ignore",
        "sector": "$.raw.yahoo_finance.sector",
        "industry": "$.raw.yahoo_finance.industry",
        "marketCap": "$.raw.yahoo_finance.marketCap",
        "currentPrice": "$.raw.yahoo_finance.currentPrice",
        "previousClose": "$.raw.yahoo_finance.previousClose",
        "open": "$.raw.yahoo_finance.open",
        "dayHigh": "$.raw.yahoo_finance.dayHigh",
        "dayLow": "$.raw.yahoo_finance.dayLow",
        "fiftyTwoWeekHigh": "$.raw.yahoo_finance.fiftyTwoWeekHigh",
        "fiftyTwoWeekLow": "$.raw.yahoo_finance.fiftyTwoWeekLow",
        "volume": "$.raw.yahoo_finance.volume",
        "averageVolume": "$.raw.yahoo_finance.averageVolume",
        "beta": "$.raw.yahoo_finance.beta",
        "trailingPE": "$.raw.yahoo_finance.trailingPE",
        "forwardPE": "$.raw.yahoo_finance.forwardPE",
        "dividendYield": "$.raw.yahoo_finance.dividendYield",
        "payoutRatio": "$.raw.yahoo_finance.payoutRatio",
        "totalCash": "$.raw.yahoo_finance.totalCash",
        "totalDebt": "$.raw.yahoo_finance.totalDebt",
        "totalRevenue": "$.raw.yahoo_finance.totalRevenue",
        "revenuePerShare": "$.raw.yahoo_finance.revenuePerShare",
        "grossProfits": "$.raw.yahoo_finance.grossProfits",
        "ebitda": "$.raw.yahoo_finance.ebitda",
        "profitMargins": "$.raw.yahoo_finance.profitMargins",
        "operatingMargins": "$.raw.yahoo_finance.operatingMargins",
        "returnOnEquity": "$.raw.yahoo_finance.returnOnEquity",
        "returnOnAssets": "$.raw.yahoo_finance.returnOnAssets",
        "debtToEquity": "$.raw.yahoo_finance.debtToEquity",
        "pegRatio": "$.raw.yahoo_finance.pegRatio",
        "recommendationKey": "$.raw.yahoo_finance.recommendationKey",
        "targetMeanPrice": "$.raw.yahoo_finance.targetMeanPrice",
        "targetHighPrice": "$.raw.yahoo_finance.targetHighPrice",
        "targetLowPrice": "$.raw.yahoo_finance.targetLowPrice",
        "earningsGrowth": "$.raw.yahoo_finance.earningsGrowth",
        "revenueGrowth": "$.raw.yahoo_finance.revenueGrowth",
        "trailingAnnualDividendRate": "$.raw.yahoo_finance.trailingAnnualDividendRate",
        "forwardAnnualDividendRate": "$.raw.yahoo_finance.forwardAnnualDividendRate",
        "bookValue": "$.raw.yahoo_finance.bookValue|ignore",
        "priceToBook": "$.raw.yahoo_finance.priceToBook|ignore",
        "enterpriseValue": "$.raw.yahoo_finance.enterpriseValue|ignore",
        "heldPercentInstitutions": "$.raw.yahoo_finance.heldPercentInstitutions|ignore",
        "heldPercentInsiders": "$.raw.yahoo_finance.heldPercentInsiders|ignore",
        "floatShares": "$.raw.yahoo_finance.floatShares",
        "sharesOutstanding": "$.raw.yahoo_finance.sharesOutstanding",
        "sharesShort": "$.raw.yahoo_finance.sharesShort",
        "shortRatio": "$.raw.yahoo_finance.shortRatio",
        "shortPercentOfFloat": "$.raw.yahoo_finance.shortPercentOfFloat|ignore",
        "mostRecentQuarter": "$.raw.yahoo_finance.mostRecentQuarter|ignore",
        "earningsQuarterlyGrowth": "$.raw.yahoo_finance.earningsQuarterlyGrowth|ignore",
        "quickRatio": "$.raw.yahoo_finance.quickRatio|ignore",
        "currentRatio": "$.raw.yahoo_finance.currentRatio|ignore",
        "logoUrl": "$.raw.yahoo_finance.logo_url|ignore",
        "fullTimeEmployees": "$.raw.yahoo_finance.fullTimeEmployees|ignore"
    }
});

db.mapping.insertOne({
    "source": "raw",
    "name": "weekly_stats",
    "destination":"stats",
    "has": "$.raw.yahoo_finance.symbol",
    "def": {
        "ticker": "$.raw.yahoo_finance.symbol",
        "shortName": "$.raw.yahoo_finance.shortName",
        "longName": "$.raw.yahoo_finance.longName|ignore",
        "sector": "$.raw.yahoo_finance.sector|ignore",
        "industry": "$.raw.yahoo_finance.industry|ignore",
        "marketCap": "$.raw.yahoo_finance.marketCap",
        "currentPrice": "$.raw.yahoo_finance.currentPrice|ignore",
        "previousClose": "$.raw.yahoo_finance.previousClose|ignore",
        "open": "$.raw.yahoo_finance.open|ignore",
        "dayHigh": "$.raw.yahoo_finance.dayHigh|ignore",
        "dayLow": "$.raw.yahoo_finance.dayLow|ignore",
        "fiftyTwoWeekHigh": "$.raw.yahoo_finance.fiftyTwoWeekHigh",
        "fiftyTwoWeekLow": "$.raw.yahoo_finance.fiftyTwoWeekLow",
        "volume": "$.raw.yahoo_finance.volume|ignore",
        "averageVolume": "$.raw.yahoo_finance.averageVolume|ignore",
        "beta": "$.raw.yahoo_finance.beta",
        "trailingPE": "$.raw.yahoo_finance.trailingPE",
        "forwardPE": "$.raw.yahoo_finance.forwardPE",
        "dividendYield": "$.raw.yahoo_finance.dividendYield",
        "payoutRatio": "$.raw.yahoo_finance.payoutRatio",
        "totalCash": "$.raw.yahoo_finance.totalCash",
        "totalDebt": "$.raw.yahoo_finance.totalDebt",
        "totalRevenue": "$.raw.yahoo_finance.totalRevenue",
        "revenuePerShare": "$.raw.yahoo_finance.revenuePerShare",
        "grossProfits": "$.raw.yahoo_finance.grossProfits",
        "ebitda": "$.raw.yahoo_finance.ebitda",
        "profitMargins": "$.raw.yahoo_finance.profitMargins",
        "operatingMargins": "$.raw.yahoo_finance.operatingMargins",
        "returnOnEquity": "$.raw.yahoo_finance.returnOnEquity",
        "returnOnAssets": "$.raw.yahoo_finance.returnOnAssets",
        "debtToEquity": "$.raw.yahoo_finance.debtToEquity",
        "pegRatio": "$.raw.yahoo_finance.pegRatio",
        "recommendationKey": "$.raw.yahoo_finance.recommendationKey",
        "targetMeanPrice": "$.raw.yahoo_finance.targetMeanPrice",
        "targetHighPrice": "$.raw.yahoo_finance.targetHighPrice",
        "targetLowPrice": "$.raw.yahoo_finance.targetLowPrice",
        "earningsGrowth": "$.raw.yahoo_finance.earningsGrowth",
        "revenueGrowth": "$.raw.yahoo_finance.revenueGrowth",
        "trailingAnnualDividendRate": "$.raw.yahoo_finance.trailingAnnualDividendRate",
        "forwardAnnualDividendRate": "$.raw.yahoo_finance.forwardAnnualDividendRate",
        "bookValue": "$.raw.yahoo_finance.bookValue",
        "priceToBook": "$.raw.yahoo_finance.priceToBook",
        "enterpriseValue": "$.raw.yahoo_finance.enterpriseValue",
        "heldPercentInstitutions": "$.raw.yahoo_finance.heldPercentInstitutions",
        "heldPercentInsiders": "$.raw.yahoo_finance.heldPercentInsiders",
        "floatShares": "$.raw.yahoo_finance.floatShares|ignore",
        "sharesOutstanding": "$.raw.yahoo_finance.sharesOutstanding|ignore",
        "sharesShort": "$.raw.yahoo_finance.sharesShort",
        "shortRatio": "$.raw.yahoo_finance.shortRatio",
        "shortPercentOfFloat": "$.raw.yahoo_finance.shortPercentOfFloat",
        "mostRecentQuarter": "$.raw.yahoo_finance.mostRecentQuarter",
        "earningsQuarterlyGrowth": "$.raw.yahoo_finance.earningsQuarterlyGrowth",
        "quickRatio": "$.raw.yahoo_finance.quickRatio",
        "currentRatio": "$.raw.yahoo_finance.currentRatio",
        "logoUrl": "$.raw.yahoo_finance.logo_url|ignore",
        "fullTimeEmployees": "$.raw.yahoo_finance.fullTimeEmployees"
    }    
});


db.mapping.insertOne({
    "source": "raw",
    "name": "monthly_stats",
    "destination":"stats",
    "has": "$.raw.yahoo_finance.symbol",
    "def": {
        "ticker": "$.raw.yahoo_finance.symbol",
        "shortName": "$.raw.yahoo_finance.shortName",
        "longName": "$.raw.yahoo_finance.longName|ignore",
        "sector": "$.raw.yahoo_finance.sector|ignore",
        "industry": "$.raw.yahoo_finance.industry|ignore",
        "marketCap": "$.raw.yahoo_finance.marketCap",
        "currentPrice": "$.raw.yahoo_finance.currentPrice|ignore",
        "previousClose": "$.raw.yahoo_finance.previousClose|ignore",
        "open": "$.raw.yahoo_finance.open|ignore",
        "dayHigh": "$.raw.yahoo_finance.dayHigh|ignore",
        "dayLow": "$.raw.yahoo_finance.dayLow|ignore",
        "fiftyTwoWeekHigh": "$.raw.yahoo_finance.fiftyTwoWeekHigh",
        "fiftyTwoWeekLow": "$.raw.yahoo_finance.fiftyTwoWeekLow",
        "volume": "$.raw.yahoo_finance.volume|ignore",
        "averageVolume": "$.raw.yahoo_finance.averageVolume|ignore",
        "beta": "$.raw.yahoo_finance.beta",
        "trailingPE": "$.raw.yahoo_finance.trailingPE",
        "forwardPE": "$.raw.yahoo_finance.forwardPE",
        "dividendYield": "$.raw.yahoo_finance.dividendYield",
        "payoutRatio": "$.raw.yahoo_finance.payoutRatio",
        "totalCash": "$.raw.yahoo_finance.totalCash",
        "totalDebt": "$.raw.yahoo_finance.totalDebt",
        "totalRevenue": "$.raw.yahoo_finance.totalRevenue",
        "revenuePerShare": "$.raw.yahoo_finance.revenuePerShare",
        "grossProfits": "$.raw.yahoo_finance.grossProfits",
        "ebitda": "$.raw.yahoo_finance.ebitda",
        "profitMargins": "$.raw.yahoo_finance.profitMargins",
        "operatingMargins": "$.raw.yahoo_finance.operatingMargins",
        "returnOnEquity": "$.raw.yahoo_finance.returnOnEquity",
        "returnOnAssets": "$.raw.yahoo_finance.returnOnAssets",
        "debtToEquity": "$.raw.yahoo_finance.debtToEquity",
        "pegRatio": "$.raw.yahoo_finance.pegRatio",
        "recommendationKey": "$.raw.yahoo_finance.recommendationKey",
        "targetMeanPrice": "$.raw.yahoo_finance.targetMeanPrice",
        "targetHighPrice": "$.raw.yahoo_finance.targetHighPrice",
        "targetLowPrice": "$.raw.yahoo_finance.targetLowPrice",
        "earningsGrowth": "$.raw.yahoo_finance.earningsGrowth",
        "revenueGrowth": "$.raw.yahoo_finance.revenueGrowth",
        "trailingAnnualDividendRate": "$.raw.yahoo_finance.trailingAnnualDividendRate",
        "forwardAnnualDividendRate": "$.raw.yahoo_finance.forwardAnnualDividendRate",
        "bookValue": "$.raw.yahoo_finance.bookValue",
        "priceToBook": "$.raw.yahoo_finance.priceToBook",
        "enterpriseValue": "$.raw.yahoo_finance.enterpriseValue",
        "heldPercentInstitutions": "$.raw.yahoo_finance.heldPercentInstitutions",
        "heldPercentInsiders": "$.raw.yahoo_finance.heldPercentInsiders",
        "floatShares": "$.raw.yahoo_finance.floatShares|ignore",
        "sharesOutstanding": "$.raw.yahoo_finance.sharesOutstanding|ignore",
        "sharesShort": "$.raw.yahoo_finance.sharesShort",
        "shortRatio": "$.raw.yahoo_finance.shortRatio",
        "shortPercentOfFloat": "$.raw.yahoo_finance.shortPercentOfFloat",
        "mostRecentQuarter": "$.raw.yahoo_finance.mostRecentQuarter",
        "earningsQuarterlyGrowth": "$.raw.yahoo_finance.earningsQuarterlyGrowth",
        "quickRatio": "$.raw.yahoo_finance.quickRatio",
        "currentRatio": "$.raw.yahoo_finance.currentRatio",
        "logoUrl": "$.raw.yahoo_finance.logo_url|ignore",
        "fullTimeEmployees": "$.raw.yahoo_finance.fullTimeEmployees"
    }    
});