import yfinance as yf
from yahoo_fin import stock_info as si  # External package for stock lists

def load_stock_tickers():
    """
    Retrieves stock tickers for the day, including top gainers, losers, 
    recent earnings reports, and analyst ratings.
    """
    stock_tickers = set()  # Use a set to prevent duplicates

    # Fetch top gainers and losers using yahoo_fin
    try:
        gainers = si.get_day_gainers()["Symbol"].tolist()
        losers = si.get_day_losers()["Symbol"].tolist()
    except Exception as e:
        print(f"Error retrieving gainers/losers: {e}")
        gainers, losers = [], []

    # Fetch stocks with recent earnings calls
    try:
        earnings_df = si.get_earnings_history()
        earnings = earnings_df["ticker"].tolist() if "ticker" in earnings_df.columns else []
    except Exception as e:
        print(f"Error retrieving earnings: {e}")
        earnings = []

    # Fetch stocks with recent analyst ratings (alternative method)
    try:
        ratings_df = si.get_analyst_price_targets()
        ratings = ratings_df.index.tolist()  # The index usually contains tickers
    except Exception as e:
        print(f"Error retrieving ratings: {e}")
        ratings = []

    # Combine all tickers into the set
    stock_tickers.update(gainers)
    stock_tickers.update(losers)
    stock_tickers.update(earnings)
    stock_tickers.update(ratings)

    return list(stock_tickers)  # Convert set to list before returning