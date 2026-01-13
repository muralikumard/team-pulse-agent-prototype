# TeamPulse Agent - 1-Hour MVP Spec

## 1. Purpose & Goal
Build a lightweight web application that lets managers and team leaders quickly log team achievements and generate simple summaries - all client-side with no backend requirements.

**Core Value:** Save managers time preparing for meetings and reviews by creating a central place to record and summarize team activities.

## 2. One-Hour MVP Focus
Create a **single-page React app** where managers can add team accomplishments and view/filter them by date range.

## 3. Core User Actions
1. **Add a team accomplishment** (1 clear form, 1 submit action)
2. **View recent accomplishments** (simple list view)
3. **Filter accomplishments by date** (basic date range selector)
4. **Generate a simple text summary** (click to compile selected items)

## 4. User Flow (Single Path)
1. User opens app → sees form + empty/sample list
2. User adds accomplishment (title, date, category, description)
3. Entry appears in chronological list below
4. User can select date range to filter entries
5. User clicks "Generate Summary" → text summary appears

## 5. Technical Constraints
- **React + Vite** single-page app (already set up)
- **No backend** - all data in localStorage
- **No authentication** - single-user local experience
- **Minimal dependencies** - avoid external libraries when possible
- **Plain CSS** - no UI frameworks needed

## 6. Data Structure
\`\`\`javascript
// Simple data model - store as JSON in localStorage
{
  "accomplishments": [
    {
      "id": "unique-id", // Generate with Date.now()
      "title": "Shipped feature X",
      "date": "2025-09-01",
      "category": "Feature", // ["Feature", "Bug Fix", "Process", "Team"]
      "description": "Team completed X ahead of schedule..."
    }
  ]
}
\`\`\`

## 7. Implementation Plan (1-hour timeline)
1. **0-10 min:** Set up basic form component with state
2. **10-25 min:** Implement localStorage save/load
3. **25-40 min:** Create list view with date filtering
4. **40-55 min:** Add summary generation feature
5. **55-60 min:** Basic styling and cleanup

## 8. Stretch Goals (only after MVP works)
- Simple data visualization (count by category)
- Export to CSV option
- Text formatting in summaries
- Team member tagging
