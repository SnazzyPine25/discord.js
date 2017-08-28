const Constants = require('../util/Constants');

/**
 * Represents a user's presence.
 */
class Presence {
  constructor(data = {}) {
    /**
     * The status of the presence:
     *
     * * **`online`** - user is online
     * * **`offline`** - user is offline or invisible
     * * **`idle`** - user is AFK
     * * **`dnd`** - user is in Do not Disturb
     * @type {string}
     */
    this.status = data.status || 'offline';

    /**
     * The game that the user is playing
     * @type {?Game}
     */
    this.game = data.game ? new Game(data.game) : null;
  }

  update(data) {
    this.status = data.status || this.status;
    this.game = data.game ? new Game(data.game) : null;
  }

  _clone() {
    const clone = Object.assign(Object.create(this), this);
    if (this.game) clone.game = this.game._clone();
    return clone;
  }

  /**
   * Whether this presence is equal to another
   * @param {Presence} presence The presence to compare with
   * @returns {boolean}
   */
  equals(presence) {
    return this === presence || (
      presence &&
      this.status === presence.status &&
      this.game ? this.game.equals(presence.game) : !presence.game
    );
  }
}

/**
 * Represents a game that is part of a user's presence.
 */
class Game {
  constructor(data) {
    /**
     * The name of the game being played
     * @type {string}
     */
    this.name = data.name;

    /**
     * The type of the game status
     * @type {GameType}
     */
    this.type = Constants.GameTypes[data.type];

    /**
     * If the game is being streamed, a link to the stream
     * @type {?string}
     */
    this.url = data.url || null;

    /**
     * If the game is in a rich presence, the details of the game
     * @type {?string}
     */
    this.details = data.details || null;

    /**
     * If the game is in a rich presence, the state of the game
     * @type {?string}
     */
    this.state = data.state || null;

    /**
     * If the game is in a rich presence, the assets included in the presence
     * @type {?string}
     */
    this.assets = data.assets ? new RichPresenceAssets(data.assets, this) : null;;
    /**
     * If the game is in a rich presence, the ID of the application that set the presence
     * @type {?string}
     */
    this.applicationID = data.application_id || null;
  }

  /**
   * Whether this game is equal to another game.
   * @param {Game} game The game to compare with
   * @returns {boolean}
   */
  equals(game) {
    return this === game || (
      game &&
      this.name === game.name &&
      this.type === game.type &&
      this.url === game.url
    );
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }
}

/**
 * Represents the assets that is part of a user's rich presence.
 */
class RichPresenceAssets {
  constructor(data, game) {
    /**
     * The text shown hovering over the large image
     * @type {string}
     */
    this.largeText = data.large_text;
    
    /**
     * The text shown hovering over the small image
     * @type {string}
     */
    this.smallText = data.small_text;

    /**
     * The ID if the large image
     * @type {string}
     */
    this.largeImage = data.large_image;
    
    /**
     * The ID if the small image
     * @type {string}
     */
    this.smallImage = data.small_image;
    
    /**
     * The game this originates from
     * @type {Game}
     */
    this.game = game;
  }

  /**
   * The URL to the small image
   * @param {Object} [options={}] Options for the image url
   * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`. If no format is provided,
   * it will be `webp`
   * @param {number} [options.size=128] One of `128`, '256', `512`, `1024`, `2048`
   * @returns {string}
   */
  smallImageURL({ format, size } = {}) {
    if (!this.smallImage) return null;
    return Constants.Endpoints.CDN(this.client.options.http.cdn).AppAsset(this.game.applicationID, this.smallImage, format, size);
  }

  /**
   * The URL to the large image
   * @param {Object} [options={}] Options for the image url
   * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`. If no format is provided,
   * it will be `webp`
   * @param {number} [options.size=128] One of `128`, '256', `512`, `1024`, `2048`
   * @returns {string}
   */
  largeImageURL({ format, size } = {}) {
    if (!this.largeImage) return null;
    return Constants.Endpoints.CDN(this.client.options.http.cdn).AppAsset(this.game.applicationID, this.largeImage, format, size);
  }

  /**
   * Whether this game is equal to another game.
   * @param {RichPresenceAssets} game The game to compare with
   * @returns {boolean}
   */
  equals(assets) {
    return this === game || (
      game &&
      this.largeText === game.largeText &&
      this.smallText === game.smallText &&
      this.largeImage === game.largeImage &&
      this.smallImage === game.smallImage
    );
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }
}

exports.Presence = Presence;
exports.Game = Game;
exports.RichPresenceAssets = RichPresenceAssets;
