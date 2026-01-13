// Mock OpenAI implementation for demonstration purposes
// This allows us to simulate AI-enhanced summaries without an actual API key

class MockOpenAI {
  constructor(options) {
    this.options = options;
    this.chat = {
      completions: {
        create: this.createChatCompletion.bind(this)
      }
    };
  }

  // Mock the chat completion API
  async createChatCompletion({ messages }) {
    // Extract the prompt from the messages
    const userMessage = messages.find(msg => msg.role === 'user');
    const prompt = userMessage?.content || '';
    
    // Parse the accomplishments data from the prompt
    let accomplishments = [];
    try {
      const match = prompt.match(/Here are the team accomplishments to summarize:\s*([\s\S]*?)\s*Format the response/);
      if (match && match[1]) {
        accomplishments = JSON.parse(match[1]);
      }
    } catch (error) {
      console.log('Error parsing accomplishments data:', error);
    }

    // Create a delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a mock enhanced summary based on the accomplishments
    const summary = this.generateEnhancedSummary(accomplishments, prompt);
    
    return {
      choices: [
        {
          message: {
            content: summary
          }
        }
      ]
    };
  }

  // Generate a high-quality summary based on the accomplishments
  generateEnhancedSummary(accomplishments, prompt) {
    // Extract date range from prompt
    const dateRangeMatch = prompt.match(/reporting period: (.*?)(?:\n|$)/i);
    const dateRange = dateRangeMatch ? dateRangeMatch[1] : 'the recent period';
    
    // Count accomplishments by category
    const categories = {};
    accomplishments.forEach(acc => {
      if (!categories[acc.category]) {
        categories[acc.category] = [];
      }
      categories[acc.category].push(acc);
    });
    
    // Get top categories
    const topCategories = Object.entries(categories)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 2)
      .map(([name, items]) => ({ name, count: items.length }));
    
    // Select a few key accomplishments
    const keyAccomplishments = [...accomplishments]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
    
    // Build an enhanced summary with business impact focus
    let summary = `# Team Performance Review\n\n`;
    summary += `## Executive Summary\n\n`;
    
    // Strategic overview
    summary += `Our team has demonstrated significant progress during ${dateRange}, completing ${accomplishments.length} impactful deliverables `;
    
    if (topCategories.length > 0) {
      const categoryText = topCategories.map(c => `${c.name} (${c.count})`).join(' and ');
      summary += `with primary focus on ${categoryText}. `;
    }
    
    // Impact statement
    summary += `These accomplishments have strengthened our product capabilities, improved team efficiency, and directly supported key business objectives.\n\n`;
    
    // Key highlights with business impact
    summary += `## Key Accomplishments & Business Impact\n\n`;
    
    keyAccomplishments.forEach(acc => {
      summary += `### ${acc.title}\n\n`;
      summary += `**Date:** ${acc.date}  \n`;
      summary += `**Category:** ${acc.category}  \n\n`;
      summary += `${acc.description}\n\n`;
      
      // Add business impact analysis based on category
      switch(acc.category) {
        case 'Feature':
          summary += `**Business Impact:** This feature enhancement directly supports our strategic goals by improving user experience and expanding product capabilities. It positions us competitively in the market and opens opportunities for expanded user adoption.\n\n`;
          break;
        case 'Bug Fix':
          summary += `**Business Impact:** This resolution enhances product stability and user satisfaction, reducing support costs and improving retention. It demonstrates our commitment to quality and responsiveness to user needs.\n\n`;
          break;
        case 'Process':
          summary += `**Business Impact:** This process improvement increases team efficiency and collaboration, leading to faster delivery cycles and reduced operational costs. It supports our organizational objective of continuous improvement.\n\n`;
          break;
        default:
          summary += `**Business Impact:** This work strengthens our team capabilities and positions us for future success through improved product quality and team effectiveness.\n\n`;
      }
    });
    
    // Accomplishments by category
    summary += `## Achievements by Category\n\n`;
    
    Object.entries(categories).forEach(([category, items]) => {
      summary += `### ${category} (${items.length})\n\n`;
      
      // For each category, provide a high-level summary of impact
      switch(category) {
        case 'Feature':
          summary += `Our feature delivery has expanded product capabilities and enhanced user experience through ${items.length} targeted improvements. These features collectively strengthen our market position and provide competitive differentiation.\n\n`;
          break;
        case 'Bug Fix':
          summary += `Our quality improvement efforts have resolved ${items.length} issues, significantly enhancing product stability and user satisfaction. This work reduces support burden and improves overall user experience.\n\n`;
          break;
        case 'Process':
          summary += `We've optimized ${items.length} internal processes, resulting in improved team efficiency and collaboration. These changes support faster delivery cycles and better resource utilization.\n\n`;
          break;
        default:
          summary += `The team has completed ${items.length} initiatives in this area, contributing to overall business objectives and team capabilities.\n\n`;
      }
      
      // List key items in this category
      items.slice(0, 3).forEach(acc => {
        summary += `* **${acc.title}** (${acc.date}): ${acc.description}\n`;
      });
      
      if (items.length > 3) {
        summary += `* Plus ${items.length - 3} additional ${category.toLowerCase()} initiatives\n`;
      }
      
      summary += `\n`;
    });
    
    // Forward-looking statement
    summary += `## Strategic Outlook\n\n`;
    summary += `Based on our recent accomplishments, the team is well-positioned for continued success. We have built momentum in key areas and established a foundation for future growth. Our focus on quality, user experience, and process efficiency will continue to drive business value and support organizational objectives.\n\n`;
    
    summary += `Next steps include leveraging our recent work to expand capabilities in high-impact areas while maintaining our commitment to quality and continuous improvement. We anticipate that our recent accomplishments will enable accelerated progress on upcoming initiatives.\n`;
    
    return summary;
  }
}

export default MockOpenAI;
