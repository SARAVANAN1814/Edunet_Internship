import '../styles/PostAuction.css'

function PostAuction() {
  return (
    <div className="post-auction-container">
      <h2>Create New Auction</h2>
      <form className="auction-form">
        <div className="form-group">
          <label htmlFor="title">Item Title</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="4" required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="startingBid">Starting Bid ($)</label>
          <input type="number" id="startingBid" name="startingBid" min="0" required />
        </div>
        <div className="form-group">
          <label htmlFor="duration">Auction Duration</label>
          <select id="duration" name="duration" required>
            <option value="24">24 Hours</option>
            <option value="48">2 Days</option>
            <option value="72">3 Days</option>
            <option value="168">7 Days</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload Images</label>
          <input type="file" id="image" name="image" accept="image/*" multiple />
        </div>
        <button type="submit" className="submit-button">Create Auction</button>
      </form>
    </div>
  )
}

export default PostAuction 