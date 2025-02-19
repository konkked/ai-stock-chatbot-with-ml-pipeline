import yfinance as yf
import json

def load_data(tickers):
    """
    Retrieves ALL available stock data from Yahoo Finance for the given tickers.

    Returns a dictionary structured as:
    {
        "SPY": { ... all available stock data ... },
        "AAPL": { ... all available stock data ... }
    }
    """
    stock_data = {}  # Dictionary to store stock details

    for ticker in tickers:
        try:
            stock = yf.Ticker(ticker)  # Fetch stock data
            info = stock.info  # Retrieve all available stock details
            
            # Store full stock data in dictionary
            stock_data[ticker] = {'raw': {'yahoo_finance': info}}
        
        except Exception as e:
            print(f"Error retrieving data for {ticker}: {e}")
            stock_data[ticker] = {"error": "Failed to fetch data"}

    return stock_data  # Return structured stock data dictionary

# Example usage:
# tickers = ["SPY", "AAPL", "TSLA", "GOOGL"]
# stock_info = load_data(tickers)

# # Display formatted output
# print(json.dumps(stock_info, indent=4))
