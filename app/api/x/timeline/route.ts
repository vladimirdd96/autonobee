import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

interface XUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

interface XTweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  entities?: {
    mentions?: Array<{ username: string }>;
    hashtags?: Array<{ tag: string }>;
    urls?: Array<{ expanded_url: string; display_url: string }>;
  };
  referenced_tweets?: Array<{
    type: "replied_to" | "retweeted" | "quoted";
    id: string;
  }>;
}

interface FormattedTweet {
  id: string;
  text: string;
  created_at: string;
  author: {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
  };
  metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  entities?: {
    mentions?: Array<{ username: string }>;
    hashtags?: Array<{ tag: string }>;
    urls?: Array<{ expanded_url: string; display_url: string }>;
  };
  referenced_tweets?: Array<{
    type: "replied_to" | "retweeted" | "quoted";
    id: string;
  }>;
}

/**
 * GET /api/x/timeline
 * Fetches the user's X.com timeline
 */
export async function GET(request: NextRequest) {
  try {
    // Check for authentication
    const isAuthenticated = cookies().get('x_auth')?.value === 'true';
    const accessToken = cookies().get('x_access_token')?.value;
    const userId = cookies().get('x_user_id')?.value;
    const authMethod = cookies().get('x_auth_method')?.value;
    
    if (!isAuthenticated || !accessToken || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get timeline parameters
    const searchParams = request.nextUrl.searchParams;
    const maxResults = parseInt(searchParams.get('max_results') || '20');
    
    // Create appropriate authorization header based on auth method
    const authHeader = authMethod === 'oauth1' 
      ? `OAuth ${accessToken}` 
      : `Bearer ${accessToken}`;
    
    // Make the API request to X.com v2 API for timeline
    const response = await axios.get(`https://api.twitter.com/2/users/${userId}/timelines/reverse_chronological`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      params: {
        'max_results': Math.min(maxResults, 50), // X API limits to 50 max
        'tweet.fields': 'created_at,public_metrics,entities,referenced_tweets',
        'user.fields': 'profile_image_url,username,name',
        'expansions': 'author_id'
      }
    });
    
    // Extract the tweets and users data
    const tweets = response.data.data || [] as XTweet[];
    const users = response.data.includes?.users || [] as XUser[];
    
    // Create a map of user IDs to user objects for easy lookup
    const userMap: Record<string, XUser> = users.reduce((map: Record<string, XUser>, user: XUser) => {
      map[user.id] = user;
      return map;
    }, {});
    
    // Combine tweet data with author data
    const formattedTweets: FormattedTweet[] = tweets.map((tweet: XTweet) => {
      const author = userMap[tweet.author_id] || {
        id: tweet.author_id,
        name: 'Unknown User',
        username: 'unknown'
      };
      
      return {
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        author: {
          id: author.id,
          name: author.name,
          username: author.username,
          profile_image_url: author.profile_image_url
        },
        metrics: tweet.public_metrics || {
          retweet_count: 0,
          reply_count: 0,
          like_count: 0,
          quote_count: 0
        },
        entities: tweet.entities,
        referenced_tweets: tweet.referenced_tweets
      };
    });
    
    return NextResponse.json({ tweets: formattedTweets });
  } catch (error: any) {
    console.error('Error fetching timeline:', error);
    
    // Handle rate limiting
    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Authentication failed. Please reconnect your X account.' },
        { status: 401 }
      );
    }
    
    // For development environments, return mock data
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock timeline data in development');
      return NextResponse.json({ 
        tweets: getMockTimelineData()
      });
    }
    
    // Return error details
    const errorDetail = error.response?.data || error.message || 'Unknown error';
    console.error('Error detail:', errorDetail);
    
    return NextResponse.json(
      { error: 'Failed to fetch timeline', detail: errorDetail },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * Generate mock timeline data for development
 */
function getMockTimelineData(): FormattedTweet[] {
  return [
    {
      id: '1',
      text: 'Just announced our new #AI feature for content creation! Check it out at autonotechnology.ai',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      author: {
        id: '12345',
        name: 'AutonoBee Official',
        username: 'AutonoBee',
        profile_image_url: 'https://placehold.co/400x400/f9b72d/000000?text=AB'
      },
      metrics: {
        retweet_count: 42,
        reply_count: 12,
        like_count: 185,
        quote_count: 5
      },
      entities: {
        hashtags: [{ tag: 'AI' }],
        urls: [{ expanded_url: 'https://autonotechnology.ai', display_url: 'autonotechnology.ai' }]
      }
    },
    {
      id: '2',
      text: 'Content is king, but distribution is queen. And she wears the pants. 👑 Remember to focus on both #ContentStrategy #Marketing',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      author: {
        id: '67890',
        name: 'Marketing Guru',
        username: 'MarketingTips',
        profile_image_url: 'https://placehold.co/400x400/1da1f2/ffffff?text=MT'
      },
      metrics: {
        retweet_count: 128,
        reply_count: 35,
        like_count: 420,
        quote_count: 13
      },
      entities: {
        hashtags: [{ tag: 'ContentStrategy' }, { tag: 'Marketing' }]
      }
    },
    {
      id: '3',
      text: 'RT @TechNews: Breaking: OpenAI announces GPT-5 with improved reasoning capabilities and multimodal understanding. This is a game changer for content creators! #AI #GPT5',
      created_at: new Date(Date.now() - 14400000).toISOString(),
      author: {
        id: '24680',
        name: 'AI Enthusiast',
        username: 'AIFanatic',
        profile_image_url: 'https://placehold.co/400x400/6c757d/ffffff?text=AI'
      },
      metrics: {
        retweet_count: 356,
        reply_count: 52,
        like_count: 1024,
        quote_count: 86
      },
      entities: {
        hashtags: [{ tag: 'AI' }, { tag: 'GPT5' }],
        mentions: [{ username: 'TechNews' }]
      },
      referenced_tweets: [
        {
          type: "retweeted",
          id: '3a'
        }
      ]
    },
    {
      id: '4',
      text: 'Just published a new blog post: "10 Ways AI Can Boost Your Content Strategy in 2024" - check it out here: contentscaling.com/ai-boost',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      author: {
        id: '13579',
        name: 'Content Scaling',
        username: 'ContentScaling',
        profile_image_url: 'https://placehold.co/400x400/20c997/ffffff?text=CS'
      },
      metrics: {
        retweet_count: 78,
        reply_count: 23,
        like_count: 312,
        quote_count: 17
      },
      entities: {
        urls: [{ expanded_url: 'https://contentscaling.com/ai-boost', display_url: 'contentscaling.com/ai-boost' }]
      }
    },
    {
      id: '5',
      text: 'What\'s your favorite tool for content creation? Mine is @AutonoBee - it\'s revolutionized my workflow! #ContentCreation #Productivity',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      author: {
        id: '97531',
        name: 'Digital Nomad',
        username: 'NomadCreator',
        profile_image_url: 'https://placehold.co/400x400/fd7e14/ffffff?text=DN'
      },
      metrics: {
        retweet_count: 14,
        reply_count: 32,
        like_count: 98,
        quote_count: 3
      },
      entities: {
        hashtags: [{ tag: 'ContentCreation' }, { tag: 'Productivity' }],
        mentions: [{ username: 'AutonoBee' }]
      }
    }
  ];
} 