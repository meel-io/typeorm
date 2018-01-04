import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src/connection/Connection";
import {expect} from "chai";
import {ConcreteEntity} from "./entity/ConcreteEntity";

describe("github issue > #1369 EntitySubscriber not firing events on abstract class entity", () => {
    
    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        subscribers: [__dirname + "/subscriber/*{.js,.ts}"],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should fire the given event for an abstract entity", () => Promise.all(connections.map(async connection => {

        const entity = new ConcreteEntity();
        entity.description = "description";
        entity.firstname = "firstname";
        entity.lastname = "lastname";
        await connection.manager.save(entity);

        const loadedEntity = await connection.manager.findOne(ConcreteEntity, { id: 1 });
        expect(loadedEntity).not.to.be.undefined;
        loadedEntity!.fullname.should.be.equal("firstname lastname");
    })));

});